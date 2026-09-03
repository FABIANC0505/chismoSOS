from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.experience import Experience
from app.models.selection_step import SelectionStep
from app.views.selection_view import SelectionStepCreate, SelectionStepUpdate, SelectionStepResponse
from app.services.auth_service import get_current_user

router = APIRouter(tags=["Selecciones Interactivas"])

@router.post("/api/experiences/{experience_id}/steps", response_model=SelectionStepResponse, status_code=status.HTTP_201_CREATED)
def add_step(
    experience_id: int,
    request: SelectionStepCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    experience = db.query(Experience).filter(
        Experience.id == experience_id,
        Experience.user_id == current_user.id
    ).first()
    if not experience:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiencia no encontrada.")

    count = db.query(SelectionStep).filter(SelectionStep.experience_id == experience_id).count()
    order = request.order_index if request.order_index is not None and request.order_index > 0 else count

    step = SelectionStep(
        experience_id=experience_id,
        question=request.question,
        option_a=request.option_a,
        option_b=request.option_b,
        option_c=request.option_c,
        reaction_text=request.reaction_text,
        order_index=order
    )
    db.add(step)
    db.commit()
    db.refresh(step)
    return step

@router.put("/api/steps/{step_id}", response_model=SelectionStepResponse)
def update_step(
    step_id: int,
    request: SelectionStepUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    step = db.query(SelectionStep).join(Experience).filter(
        SelectionStep.id == step_id,
        Experience.user_id == current_user.id
    ).first()
    if not step:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paso de selección no encontrado.")

    if request.question is not None:
        step.question = request.question
    if request.option_a is not None:
        step.option_a = request.option_a
    if request.option_b is not None:
        step.option_b = request.option_b
    if request.option_c is not None:
        step.option_c = request.option_c
    if request.reaction_text is not None:
        step.reaction_text = request.reaction_text
    if request.order_index is not None:
        step.order_index = request.order_index

    db.commit()
    db.refresh(step)
    return step

@router.delete("/api/steps/{step_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_step(
    step_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    step = db.query(SelectionStep).join(Experience).filter(
        SelectionStep.id == step_id,
        Experience.user_id == current_user.id
    ).first()
    if not step:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paso de selección no encontrado.")

    db.delete(step)
    db.commit()
    return None
