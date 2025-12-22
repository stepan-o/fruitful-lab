# backend/routers/auth.py

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import config
import models
from schemas import Token, UserCreate, UserOut
from security import (
    authenticate_user,
    create_access_token,
    get_db,
    hash_password,
    get_current_active_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    """
    Simple user registration endpoint.

    For now this is intended for internal use (creating your own account),
    not as a public sign-up flow.
    """
    existing = (
        db.query(models.User)
        .filter(models.User.email == payload.email)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    now = datetime.now(timezone.utc)

    user = models.User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        is_active=payload.is_active,
        groups=payload.groups,
        created_at=now,
        updated_at=now,
    )
    db.add(user)
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