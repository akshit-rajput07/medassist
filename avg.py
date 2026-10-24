n= int(input("enter the number of value you have"))
marks = 0
for i in range(1,n+1):
    a = int(input(f"enter number {i} mark"))
    marks = marks + a
avg = marks/n
print(avg)