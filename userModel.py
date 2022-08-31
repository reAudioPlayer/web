from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute

class UserModel(Model):
    """
    A DynamoDB User
    """
    class Meta:
        table_name = "dynamodb-user"
    username = UnicodeAttribute(range_key=True)
    password = UnicodeAttribute(hash_key=True)
    playlists = UnicodeAttribute(null=True)
    tokens = UnicodeAttribute(null=True)
