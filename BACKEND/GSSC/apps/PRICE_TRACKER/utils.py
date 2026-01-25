"""
Utility functions for price tracker
"""
import re
from typing import Optional, Dict, Any


def clean_text(text: str) -> str:
    """Clean and normalize text"""
    if not text:
        return ''
    return ' '.join(text.split())


def extract_number(text: str) -> Optional[float]:
    """Extract first number from text"""
    if not text:
        return None
    match = re.search(r'\d+\.?\d*', text.replace(',', ''))
    if match:
        try:
            return float(match.group())
        except ValueError:
            return None
    return None


def extract_price(text: str) -> Optional[float]:
    """Extract price value from text"""
    if not text:
        return None
    
    # Remove currency symbols and extract number
    cleaned = re.sub(r'[^\d.,]', '', text.replace(',', ''))
    match = re.search(r'\d+\.?\d*', cleaned)
    if match:
        try:
            return float(match.group())
        except ValueError:
            return None
    return None


def parse_specification(text: str) -> Dict[str, Any]:
    """Parse specification text and extract key-value pairs"""
    specs = {}
    if not text:
        return specs
    
    # Common patterns for specifications
    patterns = {
        'power': r'(\d+)\s*W(?:att)?s?',
        'voltage': r'(\d+)\s*V(?:olt)?s?',
        'capacity': r'(\d+)\s*Ah?',
        'efficiency': r'(\d+\.?\d*)\s*%',
        'temperature': r'(-?\d+)\s*°?C\s*to\s*(-?\d+)\s*°?C',
    }
    
    text_lower = text.lower()
    for key, pattern in patterns.items():
        match = re.search(pattern, text_lower, re.IGNORECASE)
        if match:
            if key == 'temperature':
                specs[key] = f"{match.group(1)}°C to {match.group(2)}°C"
            else:
                specs[key] = match.group(1) + ('%' if key == 'efficiency' else '')
    
    return specs


def normalize_company_name(name: str) -> str:
    """Normalize company name for consistent storage"""
    if not name:
        return ''
    
    # Remove common suffixes/prefixes and normalize
    name = name.strip()
    name = re.sub(r'\s+', ' ', name)
    
    # Capitalize properly
    words = name.split()
    normalized = ' '.join(word.capitalize() for word in words)
    
    return normalized


def validate_product_data(data: Dict[str, Any]) -> bool:
    """Validate that product data has minimum required fields"""
    required_fields = ['company', 'model', 'category']
    
    for field in required_fields:
        if not data.get(field):
            return False
    
    # Validate category
    valid_categories = ['solar_panel', 'inverter', 'battery']
    if data.get('category') not in valid_categories:
        return False
    
    return True
