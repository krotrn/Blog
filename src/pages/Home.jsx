import React, { useEffect } from 'react'
import { Container, Loading, Postcard } from '../components'
import appwriteService from '../appwrite/config'
import { useSelector } from 'react-redux'


function Home() {
    const [posts, setPosts] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        appwriteService.getPosts().then((post) => {
            if (post)
                setPosts(post.documents)
            setLoading(false)
        })
    }, [])
    if (loading) {
        return (
            <Container>
                <Loading className='ml-[50%] h-96' />
            </Container>
        )
    }


    if (authStatus && posts.length === 0) {
        return (<div className="w-full py-8 mt-4 text-center">
            <Container>
                <div className="flex flex-wrap">
                    <div className="p-2 w-full min-h-96 ">
                        <h1 className="text-2xl font-bold hover:text-[#5f5691]">
                            No Post available
                        </h1>
                    </div>
                </div>
            </Container>
        </div>)
    }
    return (
        authStatus ? (<div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/2 sm:w-1/4'>
                            <Postcard
                                $id={post.$id}
                                title={post.title}
                                featuredImage={post.featuredImage}
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </div>) : (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full min-h-96 ">
                            <h1 className="text-2xl font-bold hover:text-[#5f5691]">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    )
}

export default Home