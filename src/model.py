import torch
import torch.nn as nn
import timm

class BoneAgeNet(nn.Module):

    def __init__(self):
        super().__init__()

        self.backbone = timm.create_model(
            "efficientnet_b3",
            pretrained=False,
            num_classes=0,
            global_pool="avg"
        )

        feat_dim = self.backbone.num_features

        self.gender_fc = nn.Sequential(
            nn.Linear(1, 32),
            nn.SiLU()
        )

        self.head = nn.Sequential(
            nn.Linear(feat_dim + 32, 512),
            nn.BatchNorm1d(512),
            nn.SiLU(),
            nn.Dropout(0.35),

            nn.Linear(512, 128),
            nn.BatchNorm1d(128),
            nn.SiLU(),
            nn.Dropout(0.25),

            nn.Linear(128, 1)
        )

    def forward(self, image, gender):
        features = self.backbone(image)

        gender_features = self.gender_fc(gender)

        x = torch.cat(
            [features, gender_features],
            dim=1
        )

        return self.head(x).squeeze(1)