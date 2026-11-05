import { test, expect } from "@playwright/test"

test('GET a single post from JSONPlaceholder', async ({ request }) => {

    const response = await request.get("https://jsonplaceholder.typicode.com/posts/1")
    expect(response.status()).toBe(200)

    const post = await response.json()
    expect(post.id).toBe(1)

})

test('POST a new post from to JSONPlaceholder', async ({ request }) => {

    const post = await request.post('https://jsonplaceholder.typicode.com/posts', {

        data: {
            tittle: 'my first API test',
            body: 'learning how post work in playwright',
            userId: 1,
        },
    })

    expect(post.status()).toBe(201)
    const createpost = await post.json()
    expect(createpost.title()).toBe('my first API test')
    expect(createpost.id).toBeTruthy();



})

test('login to DummyJSON and receive a token', async ({ request }) => {
    const loginResponse = await request.post('https://dummyjson.com/auth/login',
        {
            data: {
                username: 'emilys', 
                password: 'emilyspass', 
            },
        }

    )
    expect(loginResponse.status()).toBe(200);

    const loginData = await loginResponse.json();
    console.log(loginData.accessToken)
});

// Request Chaining And Authentication
test('use token to access protected endpoint', async ({ request }) => {
    const loginResponse = await request.post('https://dummyjson.com/auth/login',
        {
            data: {
                username: 'emilys',
                password: 'emilyspass',
            },
        }

    )
    expect(loginResponse.status()).toBe(200);

    const loginData = await loginResponse.json();
    // console.log(loginData.accessToken)

    const { accessToken } = loginData

    const response = await request.get("https://dummyjson.com/auth/me",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }

        }
    )

    expect(response.status()).toBe(200);
    const responseData =await response.json()
    console.log(responseData)

});