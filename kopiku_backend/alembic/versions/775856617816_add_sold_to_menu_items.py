"""add sold to menu_items

Revision ID: 775856617816
Revises: cff6cd835e4b
Create Date: 2025-05-31 06:56:40.796231

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '775856617816'
down_revision = 'cff6cd835e4b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('menu_items', sa.Column('sold', sa.Integer(), nullable=False, server_default='0'))


def downgrade() -> None:
    op.drop_column('menu_items', 'sold') 