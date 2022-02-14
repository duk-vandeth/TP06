const scroller = document.getElementById('scrollable');
    const loader = document.getElementsByClassName('loading');
    const menu = document.getElementsByClassName('menu');

    let test = false;
    let num_page = 0;
    let crrPageNum = 0;
    let items = '';

    const loadData = () => {
        try {
            if (localStorage.getItem('page0') && crrPageNum == 0){
                let data1 = [{}];

                for (i = 0; i < localStorage.length; i++){
                    data1[i] = JSON.parse(localStorage.getItem(`page${i}`));

                    for (j in data1[i]) {
                        items += `
                            <div class="item">
                                <h4>✈️:${data1[i][j].airline[0].name} - ${data1[i][j].airline[0].country}</h4>
                                <p>🙂:${data1[i][j].name}</p>
                            </div>
                        `
                    }
                    if (crrPageNum == 2863) {
                        items += `<div style="text-align: center;">End</div>`
                    } else {
                        items += `<hr>`
                    }
                }
                scroller.innerHTML = items;
                loading(false);
                crrPageNum = i;

            }else if (crrPageNum >= 0) {
                fetch(`https://api.instantwebtools.net/v1/passenger?page=${0}&size=${10}`)
                .then(async (res) => {
                    let passengers = await res.json();
                    let airline = '';
                    let data = [{}];

                    for (let passenger = 0; passenger <10; passenger++) {
                        airline = passengers.data[passenger].airline;
                        
                        const dataAdd = {
                            name: `${passengers.data[passenger].name}`,
                                airline: [{
                                    name: `${airline[0].name}`,
                                    country: `${airline[0].country}`
                                }]
                        };
                        data[passenger] = dataAdd;
                        items += `
                                <div class="item">
                                    <h4>✈️:${airline[0].name} - ${airline[0].country}</h4>
                                    <p>🙂:${passengers.data[passenger].name}</p>
                                </div>
                            `
                    }
                    console.log(data)

                    localStorage.setItem(`page${crrPageNum}`, JSON.stringify(data))
                    setTimeout(async() => { //loading spinner
                        await loading(false);
                    }, 2000);

                    if (crrPageNum == 2863) {
                    items += `<div style="text-align: center;">End</div>`
                    } else {
                        items += `<hr>`
                    }
                    scroller.innerHTML = items;
                    crrPageNum++;
                    test = true;
                });
            }
        }catch (error) {
            console.log(error);
            cur_page--;
        }
    };
    const loading = (load) => { //loading spinner
        if (load == true) {
            loader[0].style.display = 'flex';
            menu[0].style.display = 'none';
        } else {
            loader[0].style.display = 'none';
            menu[0].style.display = 'flex';
        }
    }

    const pageNumber = (num) => {
        document.getElementsByClassName('page-number')[0].innerHTML = `Page: <span>${num}</span>`;
    }

    loading(true);
    loadData();

    scroller.addEventListener('scroll', () => {
        const clientHeight = scroller.clientHeight;
        const scollHeight = scroller.scrollHeight;
        const scrollTop = scroller.scrollTop;

            // console.log('client', clientHeight, ', height', scollHeight, ', Top', scrollTop);
        if (clientHeight + scrollTop + 200 >= scollHeight && test == true &&  crrPageNum <= 2862) {
            console.log('loading')
            localStorage.length = '';
            loadData();
            test = false;
        }

        if (clientHeight + scrollTop > (1030 * (num_page + 1)) + 600) {
            num_page++;
            pageNumber(num_page);
            console.log(num_page)
        } else if (clientHeight + scrollTop <= (1030 * (num_page) + 500)) {
            num_page--;
            pageNumber(num_page);
            console.log(num_page)
        }
    })