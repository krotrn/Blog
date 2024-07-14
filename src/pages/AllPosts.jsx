import React, { useEffect, useState } from 'react'
import { Container, Postcard } from '../components'
import appwriteService from '../appwrite/config'


function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        appwriteService.getPosts([]).then((post) => {
            if (post)
                setPosts(post.documents)
            setLoading(false)
        })
    }, [])
    if (loading) { 
        return (
            <Container>
                <div className='flex justify-center items-center min-h-96'>
                    <p>Loading...</p>
                </div>
            </Container>
        )
    }
    
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <Postcard
                                {...post}
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts