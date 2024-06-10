from django.db import models
from django.conf import settings

class NewPost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    parent_post = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.BooleanField(default=False)
    is_child_post = models.BooleanField(default=False)
    

    @property
    def username(self):
        return f"{self.user.first_name} {self.user.last_name}"

    def __str__(self):
        return f"Post by this person {self.username} - {self.content[:20]}"