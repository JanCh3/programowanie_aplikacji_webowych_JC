a = Math.floor(Math.random() * 100);
b = Math.floor(Math.random() * 100);
function logNaN(){
    console.log("Jeden z twoich symboli to nie liczba.");
}
if(isNaN(a) || isNaN(b)){
    logNaN();
}
else{
    if(a > b){
        console.log("Liczba "+a+" jest wieksza niz liczba "+b)
    }
    else{
        console.log("Liczba "+b+" jest wieksza od liczby "+a);
    }
}