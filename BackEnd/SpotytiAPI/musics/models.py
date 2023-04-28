from django.db import models


class music(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200, null=True)
    id = models.BigAutoField(primary_key=True)

    def __str__(self):
        texto = (f"{self.id} - {self.title} - {self.artist}")

        return texto

