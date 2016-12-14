var primes = [];
//initializes an array called primes

var uptoPrimes = 1000000;
for(var b=0;b<=uptoPrimes;b++){
    //this for loop will push prime numbers between 0 and the variable uptoPrimes into primes array.
    
    if (isPrime(b)){
        
        primes.push(b);
        //push function sends the number b to the primes array if it is prime.
    }
}

function filterPrimes(start, end){
    //filterPrimes function is designed to create a new array of primes that are within a given range [start, end]
    
    return primes.filter(function(val){
        //The filter function will take each element of the array (val) and send them through a given function.
        
        return (val>=start && val<=end); 
        //The filter function then returns a new array consisting of all elements that pass the test (return true).
        //This specific function will therefore return true when:
        //The given element is greater than or equal to the lowest value in the given range, 
        //AND the given element is less than or equal to the biggest value in the given range.
    });
}

function selectRandom(array){
    //selectRandom function will select a random element from a given array and return it.
    
    var index = Math.floor(Math.random()*array.length);
    //The index is a random number that will lie in the range from 0 to the length of the array minus 1
    //This is due to the fact that items are indexed starting at 0, so shifted one down from normal counting order
    //This means the last item in array's index will be the length of the array minus 1.
    
    return array[index];
}


function isPrime(n) {
    //isPrime function determines whether a given number is a prime, and will return true or false.
    
    //This function was taken from JavaScripter.net at http://www.javascripter.net/faq/numberisprime.htm
    //I have explained the function in my own words, however.
    
    if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false; 
    //the above statement will only be true if:
    //n is not defined
    //n is not a finite number
    //n is less than 2
    //(I am not sure what n%1 is, and after experimenting it seems to never be true)
    
    if (n%2==0) return (n==2);
    //if n is divisible by 2, return false unless n is 2. If n=2, n==2 will become true
    
    if (n%3==0) return (n==3);
    //if n is divisible by 3, return false unless n is 3. If n=3, n==3 will become true
    
    var m=Math.sqrt(n);
    //saves the square root of n into variable m
    
    for (var i=5;i<=m;i+=6) {
        //loop will increment variable i by 6 (starting at 5) until i reaches m.
        
        if (n%i==0)     return false;
        //if n is divisible by i, return false
        
        if (n%(i+2)==0) return false;
        //if n is divisible by i+2, return false
    }
    
    return true;
    //if the above for-loop doesn't find a divisor for n, it is prime so we return true.
}

function crackPrimes(public){
    //This is the function that cracks the generated RSA public key.
    
    var num = public;
    //We store the public key in num
    
    var startLoc = Math.floor(Math.sqrt(num));
    //The startLoc(ation) is the square root of num rounded down to a whole number
    
    var startMag = startLoc.toString().length;
    //startMag(nitude) is the number of digits in the square root of num
    
    console.log("sqrt: "+startLoc);
    //We output the square root to make sure everything is working right. (debugging purposes)
    
    var lim = 5*Math.pow(10, (startMag-1));
    //lim is the upper most limit of the possbile factors.
    //We raise 10 to the power of startMag-1, such that if startMag is 4, we get 1000.
    //We then multiply this by 5 to get the middle of the range (5000 if startMag is 4).
    
    var primerange;
    var dir;
    //dir is used as either true or false. if true, we go above startLoc, if false, we go below.
    
    var p, q;
    // p and q will be our factored primes
    
    if (startLoc > lim){
        //If the startLoc is greater than the middle of the range:
        
        primerange = filterPrimes(startLoc, uptoPrimes);
        //consider only primes between startLoc and 1000000 in this case.
        
        dir = true;
        //set dir to true so we go up from startLoc.
    }
    else{
        //If the startLoc is less than or equal to the middle of the range:
        
        primerange = filterPrimes(0, startLoc);
        //consider only primes between 0 and startLoc
        
        dir = false;
        //set dir to false so we go down from startLoc
    }
    
    if (dir){
        //If we want to go up from startLoc:
        
        for (var i=0; i<primerange.length; i++){
            //i is used as an index and will go from 0 and stop when it hits the length of the array containging our primes.
            
            var div = num/primerange[i];
            //we divide the public key (num) by the prime located at index i in primerange
            
            if (primes.indexOf(div) !== -1){
                //If div is a prime number:
                
                p=primerange[i];
                //p will be the number we divided num by
                
                q=div;
                //q will be the result of the division
                
                break;
                //break stops the loop
            }
        }
    }
    else{
        //If we want to go down from startLoc:
        
        for(var i=primerange.length-1;i>=0;i-=1){
            //We set i to the last (greatest) prime in our range, and decrease the index by 1 with each iteration.
            
            //The rest below is exactly the same as above.
            var div = num/primerange[i];
            if(primes.indexOf(div) !== -1){
                p=primerange[i];
                q=div;
                break;
            }
        }
    }
    
    console.log("cracked primes: "+p+", "+q);
    //We output the primes when we have cracked them.
}

// ----------------------------------------------------------------------------------------------------------- //

//The code below outlines how I timed the execution of the cracking function

var primerange = filterPrimes((Math.pow(10,(2))), (Math.pow(4))),
    //primerange will in this case be an array of primes between 10^2 and 10^4
    //the 2 and 4 can be dynamically altered with counting variables in loops
    
    prime1 = selectRandom(primerange),
    prime2 = selectRandom(primerange);
    //prime1 and prime2 will be two random numbers in the generated array of primes

console.log("primes: "+prime1+", "+prime2);
//We output the primes so that we know they match up with the ones that we crack later

var n = prime1*prime2,
    //n is the public key, the product of the two primes
    
    t0 = performance.now();
    //performance.now() will record the time in milliseconds to the accuracy of microseconds

crackPrimes(n);
//execute the cracking of n

var t1=performance.now(),
    //take the time again
    
    time = (t1-t0).toFixed(1);
    //we subtract the times to find the time it took to crack the primes, and reduce it to one decimal point.

console.log("success "+(j+1));
//this output was used in junction with a loop so we could see how many times it had cracked a number.

console.log(time);
//Output the time taken to crack.
     


