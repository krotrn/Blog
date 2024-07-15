import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, RTE, Loading } from '../index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';



export default function PostForm({ post }) {

  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post ? post.title : '',
      slug: post ? post.slug : '',
      content: post ? post.content : '',
      status: post ? post.status : 'active'
    }
  });
  const navigate = useNavigate()
  const userData = useSelector(state => state.auth.userData)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filled, setFilled ] = useState(false);
  const submit = async (data) => {
    setLoading(true);
    setError(false);
    try {
      if (post) {
        setFilled(false);
        const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null

        if (file) {
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined
        })

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`)
        }
      } else {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          setFilled(true);
          const fileId = file.$id;
          data.featuredImage = fileId;
          const dbPost = await appwriteService.createPost({
            ...data,
            userId: userData.$id,
          });

          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
          else {
            setError(true);
          }
        }
        else {
          setError(true);
        }
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  const slugTransform = useCallback((value) => {
    if (value && typeof value === 'string')
      return value
        .trim()
        .toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    return '';
  }, [])

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue('slug', slugTransform(value.title, { shouldVaildate: true }));
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, slugTransform, setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title* :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        {error && <p className="text-red-500">{filled ? "already taken" : "fill the slug"}</p>}
        <Input
          label="Slug* :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setFilled(false);
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
          }}
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
      </div>
    </form>
  )
}