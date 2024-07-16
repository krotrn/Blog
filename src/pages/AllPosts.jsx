import React, { useEffect, useState } from 'react'
import { Container, Loading, Postcard } from '../components'
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
                <Loading className='ml-[50%] min-h-screen' />
            </Container>
        )
    }
    
    return (
        <div className='w-full py-8 min-h-screen'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/2 sm:w-1/4'>
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