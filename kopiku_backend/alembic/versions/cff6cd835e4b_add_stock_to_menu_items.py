"""add stock to menu_items

Revision ID: cff6cd835e4b
Revises: 1c9c98a4ee6d
Create Date: 2025-05-31 06:39:03.955891

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cff6cd835e4b'
down_revision = '1c9c98a4ee6d'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('menu_items', sa.Column('stock', sa.Integer(), nullable=False, server_default='0'))
def downgrade():
    op.drop_column('menu_items', 'stock')