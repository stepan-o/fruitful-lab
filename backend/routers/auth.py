# backend/routers/auth.py

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import config
import models
from account_service import create_user
from schemas import Token, UserCreate, UserOut
from security import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
    get_current_admin_user,
    get_db,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin_user),
):
    """Legacy internal registration; role groups require administrator authority."""
    user = create_user(
        db,
        str(payload.email),
        payload.full_name or str(payload.email),
        payload.password,
        groups=payload.groups,
    )
    user.is_active = payload.is_active
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    OAuth2 password flow-compatible login.

    Accepts form fields:
      - username: email
      - password
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=config.JWT_ACCESS_TOKEN_EXPIRE_MINUTES,
    )
    access_token = create_access_token(
        subject=user.email,
        expires_delta=access_token_expires,
        session_version=user.session_version,
    )

    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserOut)
async def read_current_user(
    current_user: models.User = Depends(get_current_active_user),
):
    """
    Return the currently authenticated user.

    Used by the frontend to hydrate session info.
    """
    return current_user
