from pathlib import Path
from typing import List
from uuid import uuid4
import shutil

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.extraction.docx_extractor import extract_docx_text
from app.graphs.ingestion.graph import resume_ingestion_graph
from app.db.repositories.candidate_repository import (
    create_or_update_candidate,
    create_resume_record,
)

router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"],
)

UPLOAD_DIR = Path("storage")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE_MB = 10


@router.post("/upload")
async def upload_resumes(files: List[UploadFile] = File(...)):
    uploaded_files = []

    for file in files:
        original_filename = file.filename or ""

        if not original_filename:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file must have a filename.",
            )

        if not original_filename.lower().endswith(".docx"):
            raise HTTPException(
                status_code=400,
                detail=f"{original_filename} is not supported. Only .docx files are allowed.",
            )

        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        max_size_bytes = MAX_FILE_SIZE_MB * 1024 * 1024

        if file_size > max_size_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"{original_filename} exceeds {MAX_FILE_SIZE_MB} MB limit.",
            )

        resume_id = str(uuid4())
        stored_filename = f"{resume_id}.docx"
        file_path = UPLOAD_DIR / stored_filename

        try:
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            raw_text = extract_docx_text(str(file_path))

            graph_result = resume_ingestion_graph.invoke(
                {
                    "resume_id": resume_id,
                    "original_filename": original_filename,
                    "stored_filename": stored_filename,
                    "file_path": str(file_path),
                    "file_type": "docx",
                    "raw_text": raw_text,
                    "extracted_candidate": None,
                    "validation_errors": [],
                    "processing_status": "TEXT_EXTRACTED",
                }
            )

            candidate = graph_result.get("extracted_candidate")
            processing_status = graph_result.get(
                "processing_status",
                "UNKNOWN",
            )
            validation_errors = graph_result.get("validation_errors", [])

            candidate_id = None

            if candidate and processing_status == "VALIDATED":
                candidate_id = create_or_update_candidate(candidate)
                processing_status = "COMPLETED"

            create_resume_record(
                resume_id=resume_id,
                candidate_id=candidate_id,
                original_filename=original_filename,
                stored_filename=stored_filename,
                file_path=str(file_path),
                file_type="docx",
                processing_status=processing_status,
                raw_text=raw_text,
            )

        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process {original_filename}: {str(exc)}",
            )

        uploaded_files.append(
            {
                "resume_id": resume_id,
                "candidate_id": candidate_id,
                "original_filename": original_filename,
                "stored_filename": stored_filename,
                "file_path": str(file_path),
                "file_type": "docx",
                "status": processing_status,
                "text_preview": raw_text[:500],
                "text_length": len(raw_text),
                "candidate": candidate,
                "validation_errors": validation_errors,
            }
        )

    return {
        "message": "Files uploaded, extracted, and stored successfully",
        "count": len(uploaded_files),
        "files": uploaded_files,
    }