from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, MapAttribute, ListAttribute

class UserModel(Model):
    """
    A DynamoDB User
    """
    class Meta:
        table_name = "dynamodb-user"
        region = "eu-central-1"
    password = UnicodeAttribute(range_key=True)
    username = UnicodeAttribute(hash_key=True)
    playlists = ListAttribute()
    tokens = MapAttribute()
