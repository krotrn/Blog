import React, { memo, useCallback, useState, useEffect, lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../../appwrite/config';

// Lazy load components
const Button = lazy(() => import('../Button'));
const Input = lazy(() => import('../Input'));
const Select = lazy(() => import('../Select'));
const RTE = lazy(() => import('../RTE'));
const Loading = lazy(() => import('../Loading'));

const PostForm = ({ post }) => {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post ? post.title : '',
      slug: post ? post.slug : '',
      content: post ? post.content : '',
      status: post ? post.status : 'active',
    },
  });

  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // For error handling
  let uploadedFileId = null;

  const submit = useCallback(async (data) => {
    setLoading(true);
    uploadedFileId = null;
    try {
      if (post) {
        const file = data.image?.[0] ? await appwriteService.uploadFile(data.image[0]) : null;

        if (file) {
          uploadedFileId = file.$id;
          await appwriteService.deleteFile(post.featuredImage);
        }

        const updatedPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : post.featuredImage,
        });

        if (updatedPost) {
          navigate(`/post/${updatedPost.$id}`);
        }
      } else {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          uploadedFileId = file.$id;
          const newPost = await appwriteService.createPost({
            ...data,
            userId: userData.$id,
            featuredImage: file.$id,
          });

          if (newPost) {
            navigate(`/post/${newPost.$id}`);
          }
        }
      }
    } catch (error) {
      setError('Something went wrong while saving the post');
      if (uploadedFileId) {
        await appwriteService.deleteFile(uploadedFileId);
      }
    } finally {
      setLoading(false);
    }
  }, [post, navigate, userData]);

  const slugTransform = useCallback((value) => {
    return value
      ? value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, '-').replace(/\s+/g, '-')
      : '';
  }, []);

  useEffect(() => {
    const subscription = watch(({ title }) => {
      if (title) {
        setValue('slug', slugTransform(title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <Suspense fallback={<div className='flex bg-[#232B42] justify-center items-center min-h-screen'>
      <Loading />
    </div>}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-wrap text-[#a59bd6] mt-4 font-medium min-h-screen">
        <div className="w-2/3 px-2">
          <Input
            label="Title* :"
            placeholder="Title"
            className="mb-4"
            {...register("title", { required: true })}
          />
          <Input
            label="Slug* :"
            placeholder="Slug"
            className={`mb-4 ${post ? "bg-[#3a3939]" : ""}`}
            disabled={!!post}
            {...register("slug", { required: !post })}
            onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })}
          />
          <RTE label="Content* :" name="content" control={control} defaultValue={getValues("content")} />
        </div>

        <div className="w-1/3 px-2">
          <Input
            label="Featured Image* :"
            type="file"
            className="mb-4"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", { required: !post })}
          />
          {post && (
            <div className="w-full mb-4">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="rounded-lg"
              />
            </div>
          )}
          <Select
            options={["active", "inactive"]}
            label="Status"
            className="mb-4"
            {...register("status", { required: true })}
          />
          <Button type="submit" disabled={loading} bgColor={post ? "bg-green-500" : undefined} className="w-full">
            {loading ? <Loading className='ml-[50%]' color='white' /> : post ? 'Update' : 'Submit'}
          </Button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </form>
    </Suspense>
  );
};

export default memo(PostForm);
