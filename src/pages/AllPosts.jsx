import React, { useEffect, useState } from 'react'
import { Container, Postcard } from '../components'
import appwriteService from '../appwrite/config'


function AllPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        appwriteService.getPosts([]).then((post) => {
            if (post)
                setPosts(post.documents)
        })
    }, [])

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <Postcard
                                $id={post.$id}
                                title={post.title}
                                featuredImage={post.featuredImage}
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts