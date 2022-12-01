# [AWK command in Unix/Linux with examples](https://www.geeksforgeeks.org/awk-command-unixlinux-examples)


## WHAT CAN WE DO WITH AWK

1. AWK Operations:
   - (a) Scans a file line by line
   - (b) Splits each input line into fields
   - (c) Compares input line/fields to pattern
   - (d) Performs action (s) on matched lines

2. Useful For:
   - (a) Transform data files
   - (b) Produce formatted reports

3. Programming Constructs:
   - (a) Format output lines
   - (b) Arithmetic and string operations
   - (c) Conditionals and loops 

```
# - Syntax
awk options 'selection _criteria {action }' input-file > output-file

# - Options
-f program-file : Reads the AWK program source from the file 
                  program-file, instead of from the 
                  first command line argument.
-F fs            : Use fs for the input field separator
```


```shell
# By default Awk prints every line of data from the specified file. 
awk '{print}' employee.txt

# 2. Print the lines which match the given pattern. 
awk '/manager/ {print}' employee.txt 

# 3. Splitting a Line Into Fields 
awk '{print $1,$4}' employee.txt 
```

- Built in variables:
  - $1, $2, $3, and so on ($0 is the entire line), that break a line of text into individual words or pieces called fields.
  - $NF: Display Last Field
  - NR: Display Line Number
  - FS: Field separator (for input)
  - RS: Record separator (default is a newline)
  - OFS: output field separator, separates the fields when Awk prints them. (default is a blank space)
  - ORS: output record separator (default is a newline character)

```shell
# Use different field separator 
awk -F "=" '{print $2}' example.env
awk '{print $2}' FS="=" example.env
awk 'BEGIN{FS="="} {print $2}' example.env

# print value only for specific match
awk -F "=" '/NGINX_HOST/ {print $2}' example.env

# Display Line Number
awk '{print NR,$0}' employee.txt 

# Display Last Field
awk '{print $1,$NF}' employee.txt 

# Display Line From 3 to 6
awk 'NR==3, NR==6 {print NR,$0}' employee.txt 

#  print the first item along with the row number(NR) separated with ” – “ from each line
awk '{print NR "- " $1 }' employee.txt 

# find the length of the longest line present in the file:  
awk '{ if (length($0) > max) max = length($0) } END { print max }' geeksforgeeks.txt

# count the lines in a file:  
awk 'END { print NR }' geeksforgeeks.txt

# Printing lines with more than 10 characters:  
awk 'length($0) > 10' geeksforgeeks.txt 

# find/check for any string in any specific column: 
awk '{ if($2 == "B6") print $0;}' geeksforgeeks.txt 

# print the squares of first numbers from 1 to n say 6:  
awk 'BEGIN { for(i=1;i<=6;i++) print "square of", i, "is",i*i; }' 

# Add header to output
who | awk 'BEGIN {print "Active Sessions"} {print $1,$4}'
```
