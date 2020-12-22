function zeros(N, M) {
    return [...Array(N + 1)].map(x => [...Array(M + 1)].map(x => 0))
}

function U0(x, x0, l, Z) {
    if (x > x0 && x < x0 + l)
        return Z
    else
        return 0
}

function U1(x, x0, l, Z) {
    const x1 = x0
    const x2 = x0 + l
    const center = 0.5 * (x1 + x2)
    if (x >= x1 && x < center)
        return Z * (x - x1) / (center - x1)
    else if (x <= x2 && x >= center)
        return Z - Z * (x - center) / (x2 - center)
    else
        return 0
}

function U2(x, x0, l, Z) {
    if (x > x0 && x < x0 + l)
        return Z * Math.pow(Math.sin((x - x0) * Math.PI / l), 2)
    else
        return 0
}

var chart = null
function plot(x, data1, data2) {
    if (chart)
        chart.clear()
    var ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: x.map(x => x.toFixed(2)),
            datasets: [
                {
                    label: 'A',
                    borderColor: 'rgb(255, 99, 132)',
                    data: data1,
                    lineTension: 0
                },
                {
                    label: 'B',
                    borderColor: 'rgb(0, 0, 0)',
                    data: data2,
                    lineTension: 0
                }
            ]
        },

        // Configuration options go here
        options: {
            animation: {
                duration: 0
            },
            bezierCurve: false,
            elements: {
                line: {
                    tension: 0
                }
            }
        }
    });
}

const N =  50 /* 150 и 500*/
const L = 1
const x = linspace(0, L, N)

let ts = []
let t2s = []

const slider = document.querySelector('input')
slider.addEventListener('input', function () {
    plot(x, ts[slider.value - 1], t2s[slider.value - 1])
})

const select = document.getElementById('kurant')

let tau = select.value

select.addEventListener('change', function () {
    tau = select.value
    calc()
})

const select2 = document.getElementById('type')
select2.addEventListener('change', function () {
    calc()
})


calc()
function calc() {
    ts = []
    t2s = []
    slider.value = 1

    const a = 0.5
    const h = L / N
    const T = 1
    const M = parseInt(T / tau)
    const U = zeros(M, N)
    const R = zeros(M, N)
    const u0 = zeros(1, N)
    const x0 = 0.1
    const l = 0.2
    const Z = 1

    let f = null
    switch (select2.value) {
        case '1':
            f = U2
            break
        case '2':
            f = U0
            break
        case '3':
            f = U1
            break
    }
    for (let i = 1; i <= N; i++) {
        u0[0][i] = f(x[i], x0, l, Z)
    }
	
    U[1] = [].concat(u0[0])
	
	const W = a * tau / h
	console.log(W)
	
    for (let n = 1; n <= M - 1; n++) {
        for (let j = 2; j <= N; j++) {
            
            let odin = 0
            let dvadin = 0
			
			/*Один*/
			if ( (U[n][j + 1] - U[n][j]) * (U[n][j] - U[n][j - 1]) < 0) {
				odin = U[n][j] + ((1-W)/2) * 0
			} else if  (0 <= Math.abs(U[n][j] - U[n][j - 1]) && Math.abs(U[n][j] - U[n][j - 1]) < 0.4 * Math.abs(U[n][j + 1] - U[n][j])){
				odin = U[n][j] + ((1-W)/2) * 2 * (U[n][j] - U[n][j - 1])
			} else if  (0.4 * Math.abs(U[n][j + 1] - U[n][j]) <= Math.abs(U[n][j] - U[n][j - 1]) && Math.abs(U[n][j] - U[n][j - 1]) < 1.6 * Math.abs(U[n][j + 1] - U[n][j]) ) {
				odin = U[n][j] + ((1-W)/2) * ( 2 * (U[n][j + 1] - U[n][j]) + (U[n][j] - U[n][j - 1]))/3
			} else if  (1.6 * Math.abs(U[n][j + 1] - U[n][j]) <= Math.abs(U[n][j] - U[n][j - 1])&&  Math.abs(U[n][j] - U[n][j - 1]) < 2 * Math.abs(U[n][j + 1] - U[n][j]) ) {
				odin = U[n][j] + ((1-W)/2) *2 * ((U[n][j] - U[n][j - 1])-(U[n][j + 1] - U[n][j]))
			} else if  (Math.abs(U[n][j] - U[n][j - 1]) >= 2 * Math.abs(U[n][j + 1] - U[n][j])) {
				odin = U[n][j] + ((1-W)/2) *2 * (U[n][j + 1] - U[n][j])
			}

			
			/*Двадин*/
			if ((U[n][j] - U[n][j - 1])*(U[n][j-1] - U[n][j - 2]) < 0) {
				dvadin = U[n][j-1] + ((1-W)/2) * 0
			} else if  ( 0 <= Math.abs(U[n][j-1] - U[n][j - 2]) && Math.abs(U[n][j-1] - U[n][j - 2]) < 0.4*Math.abs(U[n][j] - U[n][j - 1])) {
				dvadin = U[n][j-1] + ((1-W)/2) * 2 *(U[n][j-1] - U[n][j - 2])
			} else if  (0.4*Math.abs(U[n][j] - U[n][j - 1]) <= Math.abs(U[n][j-1] - U[n][j - 2]) && Math.abs(U[n][j-1] - U[n][j - 2]) < 1.6 * Math.abs(U[n][j] - U[n][j - 1]) ) {
				dvadin = U[n][j-1] + ((1-W)/2) * (2 * (U[n][j] - U[n][j - 1]) + (U[n][j-1] - U[n][j - 2]))/3
			} else if  (1.6*Math.abs(U[n][j] - U[n][j - 1]) <= Math.abs(U[n][j-1] - U[n][j - 2])  && Math.abs(U[n][j-1] - U[n][j - 2])< 2* Math.abs(U[n][j] - U[n][j - 1]) ) {
				dvadin = U[n][j-1] + ((1-W)/2) * 2 * ((U[n][j-1] - U[n][j - 2]) - (U[n][j] - U[n][j - 1]))
			} else if  (Math.abs(U[n][j-1] - U[n][j - 2]) >= 2 * Math.abs(U[n][j] - U[n][j - 1]) ) {
				dvadin = U[n][j-1] + ((1-W)/2) * 2 * (U[n][j] - U[n][j - 1])
			}
			
		
            U[n + 1][j] = U[n][j] - W * (odin - dvadin)		
			
			
			
            let k = x[j] - a * tau * (n - 1)

            while (k <= 0) {
                k += L - h
            }

            u0[0][j] = f(k, x0, l, Z)
        }

        U[n + 1][1] = U[n + 1][N]
        u0[0][1] = u0[0][N]

        R[n] = [].concat(u0[0])

        // plot(x,u0[0],U[n])
        // setTimeout(() => {
        //     const t = [].concat(R[n])
        //     const t2 = [].concat(U[n])
        //     plot(x, t, t2)
        // }, 10 * n)

        ts.push([].concat(R[n]))
        t2s.push([].concat(U[n]))
        slider.setAttribute('max', ts.length)
        plot(x, ts[0], t2s[0])

        // console.log(asciichart.plot(U[1], { height: 10 }))
    }
}