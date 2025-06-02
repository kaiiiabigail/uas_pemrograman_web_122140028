from zope.interface import Interface

class IJSONSchema(Interface):
    """Interface for JSON schema validation and serialization."""
    
    def load(data):
        """Validate and deserialize input data."""
        
    def setschemaby_method(method):
        """Adjust schema based on HTTP method.""" 