from datetime import datetime
from sqlalchemy.orm import Session
from app.models.business import Business

FREE_PLAN_MONTHLY_LIMIT = 50


def check_and_increment_usage(db: Session, business: Business) -> tuple[bool, str | None]:
    """Returns (allowed, upgrade_message). Resets monthly, enforces free-plan limit."""
    current_month = datetime.utcnow().strftime("%Y-%m")

    if business.usage_reset_month != current_month:
        business.ai_replies_this_month = 0
        business.usage_reset_month = current_month

    if business.plan == "free" and business.ai_replies_this_month >= FREE_PLAN_MONTHLY_LIMIT:
        db.commit()
        return False, (
            "Hi! You've reached this month's free plan limit of 50 AI replies. "
            "Upgrade to Zento AI Growth for unlimited replies at zentoai.app/pricing, "
            "or ask the business owner to upgrade."
        )

    business.ai_replies_this_month += 1
    db.commit()
    return True, None