import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.transforms import ToTensor

#!: download training data from built-in datasets
traning_data = datasets.FashionMNIST(
    root="data",
    train=True,
    download=True,
    transform=ToTensor(),
)

#!: download test data from built-in datasets
test_data = datasets.FashionMNIST(
    root="data",
    train=False,
    download=True,
    transform=ToTensor(),
)

#!: create data loaders, (batch_size = 64)
train_dataloader = DataLoader(traning_data, batch_size=64)
test_dataloadeer = DataLoader(test_data, batch_size=64)
#define using device
device = torch.accelerator.current_accelerator().type if torch.accelerator.is_available() else 'cpu' #?: 'cpu' needs to be lowercase the use .upper()
print(f"Using: {device.upper()} device")

#!: define neural network (inherits from nn.Module)
class neuralnetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28*28, 512),
            nn.ReLU(),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, 10)
        )
    
    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits

model = neuralnetwork().to(device)

#!: define loss function and optimizer
loss = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=1e-3)

#!: define train function
def train(dataloader, model, lossfn, optim):
    size = len(dataloader.dataset)
    model.train()
    for batch, (X, y) in enumerate(dataloader):
        X, y = X.to(device), y.to(device)

        #?: compute prediction error
        prediction = model(X)
        loss = lossfn(prediction, y)

        #?: Backpropagation
        loss.backward()
        optim.step()
        optim.zero_grad()

        if batch % 100 == 0:
            loss, current = loss.item(), (batch+1)*len(X)
            print(f"Loss: {loss:>7f} [{current:>5d}/{size:>5d}]")

#!: define test function
def test(dataloader, model, loss):
    size = len(dataloader.dataset)
    num_batches = len(dataloader)
    model.eval()
    test_loss, correct = 0, 0
    with torch.no_grad():
        for X, y in dataloader:
            X, y = X.to(device), y.to(device)
            predict = model(X)
            test_loss += loss(predict, y).item()
            correct += (predict.argmax(1) == y).type(torch.float).sum().item()
    test_loss /= num_batches
    correct /= size
    print(f'Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg. Loss: {test_loss:>0.8f} \n')

epoch = 5
for t in range(epoch):
    print(f"Epoch {t+1}\n-------------------------------")
    train(train_dataloader, model, loss, optimizer)
    test(test_dataloadeer, model, loss)
print('Done!')

#!: Save model
torch.save(model.state_dict(), "train_data/model.pth")

classes = [
    "T-shirt/top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot",
]

model.eval()
x, y = test_data[0][0], test_data[0][1]
with torch.no_grad():
    x = x.to(device)
    pred = model(x)
    predicted, actual = classes[pred[0].argmax(0)], classes[y]
    print(f'Predicted: "{predicted}", Actual: "{actual}"')