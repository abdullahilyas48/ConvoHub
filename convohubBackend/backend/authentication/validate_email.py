import re

def validate_email(email):
    """
    Validates an email based on the criteria:
    - Starts with the letter 'l'
    - Followed by exactly 6 digits
    - Ends with '@lhr.nu.edu.pk'

    Args:
        email (str): The email address to validate.

    Returns:
        str: 'Valid' if the email meets the criteria, otherwise 'Invalid'.
    """
    pattern = r'^l\d{6}@lhr\.nu\.edu\.pk$'
    if re.match(pattern, email):
        return 'Valid'
    return 'Invalid'