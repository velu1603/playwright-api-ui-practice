import { test, expect }                           from '../../fixtures/api-fixture'

test.describe('Jsonplaceholder API testing', () => {

 test('Jsonplaceholder GET test ',async({apiClient})=>{
    const resp = await apiClient({
    method:'GET',
    baseUrl:'https://jsonplaceholder.typicode.com',
    path:'/users',
    uiMode:true,
    testStep:true
     
    })
        expect(resp.status,`Response should be ${resp.status}`).toBe(200)


  })

})