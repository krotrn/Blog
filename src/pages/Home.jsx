import React, { memo, useState, useEffect, useCallback, lazy, Suspense } from 'react';
import appwriteService from '../appwrite/config';
import { useSelector } from 'react-redux';

// Lazy load components to improve performance
const Container = lazy(() => import('../components/Container/Container'));
const Loading = lazy(() => import('../components/Loading'));
const Postcard = lazy(() => import('../components/Postcard'));

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Track API call errors
  const authStatus = useSelector((state) => state.auth.status);

  // Memoized API call function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const postResponse = await appwriteService.getPosts();
      if (postResponse && postResponse.documents) {
        setPosts(postResponse.documents);
      } else {
        setError('No posts found.');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load posts');
      setLoading(false);
    }
  }, []);

    // Fetch data when component mounts
    useEffect(() => {
        if (authStatus) {
            fetchData();
        }
        else {
            setLoading(false);
        }
        }, [fetchData, authStatus]);

  // Shared Suspense fallback for consistency
  const SuspenseWrapper = ({ children }) => (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );

  // Render loading state
  if (loading) {
    return (
      <SuspenseWrapper>
        <Container>
          <Loading className='ml-[50%] min-h-screen' />
        </Container>
      </SuspenseWrapper>
    );
  }

  // Render login prompt if user is not authenticated
  if (!authStatus) {
    return (
      <div className="w-full py-8 mt-4 text-center min-h-screen">
        <SuspenseWrapper>
          <Container>
            <h1 className="text-2xl font-bold hover:text-[#5f5691]">
              Login to read posts
            </h1>
          </Container>
        </SuspenseWrapper>
      </div>
    );
  }
  // Render error message if API call fails
  if (error) {
    return (
      <div className="w-full py-8 mt-4 text-center min-h-screen">
        <SuspenseWrapper>
          <Container>
            <h1 className="text-2xl font-bold text-red-500">Error: {error}</h1>
          </Container>
        </SuspenseWrapper>
      </div>
    );
  }


  // Render no posts available message if posts array is empty
  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <SuspenseWrapper>
          <Container>
            <h1 className="text-5xl font-bold text-[#4b9fb3] hover:text-[#567891]">
              No Posts Available
            </h1>
          </Container>
        </SuspenseWrapper>
      </div>
    );
  }

  // Render posts
  return (
    <div className='w-full py-8 min-h-screen'>
      <SuspenseWrapper>
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
      </SuspenseWrapper>
    </div>
  );
}

export default memo(Home); // Use memo to prevent unnecessary re-renders
