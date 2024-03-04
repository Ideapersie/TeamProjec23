"""
Auxiliary methods used in the payment routes.

This module is concerned with authenticating credit card numbers.
"""
def luhn_algorithm(card_number):
    """
    Validates whether a card number has the possibility of being correct.

    This method uses the Luhn algorithm to check validity.
    In real life, if a card number passes the Luhn check, it's not a guarantee on validity.
    Since we're not concerned with real accounts, we can assume a Luhn check is a guarentee on validity.

    Args:
        card_number: The card number to validate.

    Returns:
        A boolean indicating whether the card number is valid.
    """
    card_number_list = []

    for i in range(len(card_number)):
        card_number_list.append(int(card_number[i]))


    for i in range(len(card_number_list) - 1, -1, -1):
        if (i % 2 == 0):
            continue
        doubled = card_number_list[i] * 2
        if (doubled > 9):
            card_number_list[i] = int(str(doubled)[0]) + int(str(doubled)[1])
        else:
            card_number_list[i] = doubled

    sum = 0
    for i in range(len(card_number_list)):
        sum += card_number_list[i]

    if sum % 10 == 0:
        return True
    else:
        return False