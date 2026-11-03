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