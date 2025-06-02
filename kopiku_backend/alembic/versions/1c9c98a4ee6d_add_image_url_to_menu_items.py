"""add image_url to menu_items

Revision ID: 1c9c98a4ee6d
Revises: 001
Create Date: 2025-05-31 06:03:20.539413

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1c9c98a4ee6d'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('menu_items', sa.Column('image_url', sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column('menu_items', 'image_url') 