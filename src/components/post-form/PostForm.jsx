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
  let uploadedFileId = null;
  const submit = async (data) => {
    setLoading(true);
    setError(false);
    uploadedFileId = null;
    try {
      if (post) {
        const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null

        if (file) {
          uploadedFileId = file.$id;
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id ,{
          ...data,
          featuredImage: file ? file.$id : undefined
        })

        if (!dbPost && uploadedFileId) {
          await appwriteService.deleteFile(uploadedFileId);
        } else if (dbPost) {
          navigate(`/post/${dbPost.$id}`)
        }
      } else {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          uploadedFileId = file.$id;
          data.featuredImage = file.$id;
          const dbPost = await appwriteService.createPost({
            ...data,
            userId: userData.$id,
          });

          if (!dbPost && uploadedFileId) {
            await appwriteService.deleteFile(uploadedFileId);
            setError(true);
          } else if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        } else {
          setError(true);
        }
      }
    } catch (error) {
      setError(true);
      if (uploadedFileId) {
        await appwriteService.deleteFile(uploadedFileId);
      }
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
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap text-[#a59bd6] font-medium">
      <div className="w-2/3 px-2">
        <Input
          label="Title* :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        {error && <p className="text-red-500">{"Slug already taken"}</p>}
        <Input
          label="Slug* :"
          placeholder="Slug"
          className={"mb-4" + (post ? " bg-[#3a3939]" : "")}
          disabled={post? true : false}
          {...register("slug", { required: post ? false : true })}
          onInput={(e) => {
            setError(false);
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