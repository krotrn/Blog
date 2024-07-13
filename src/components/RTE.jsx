// Importing necessary libraries and components
import React from 'react'; // React library for building user interfaces
import { Editor } from '@tinymce/tinymce-react'; // TinyMCE React component for rich text editing
import { Controller } from 'react-hook-form'; // Controller component from react-hook-form for form control

// Defining and exporting the RTE (Rich Text Editor) component
// This component is designed to be reusable and integrates with react-hook-form for form handling
// It accepts props for name, control, label, and an optional defaultValue
export default function RTE({
    name,
    control,
    label,
    defaultValue = ''
}) {
    return (
        // Container div for the RTE component
        <div className='w-full'>
            {/* Conditionally rendering a label if one is provided */}
            {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
            {/* Using the Controller component from react-hook-form to manage the RTE state */}
            <Controller
                name={name || 'content'} // Using the provided name or defaulting to 'content'
                control={control} // Using the control object provided by react-hook-form
                // Render prop to render the actual Editor component
                render={({ field: {onChange} }) => (
                    <Editor
                        apiKey='o4paqnlxc19p0r3z7mr4jor841mhzrr1p1gw0q9f8ryl5cuf'
                        initialValue={defaultValue} // Setting the initial value of the editor
                        init={{
                            height: 500, // Setting the height of the editor
                            menubar: true, // Enabling the menu bar
                            plugins: [
                                // Listing the plugins to include in the editor
                                "advlist", "autolink", "lists", "link", "image",
                                "charmap", "preview", "anchor", "searchreplace", "visualblocks",
                                "code", "fullscreen", "insertdatetime", "media", "table"
                                , "help", "wordcount", "paste", "imagetools"

                            ],
                            toolbar:
                                // Configuring the toolbar with various options
                                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }" // Setting default content styling
                        }}
                        onEditorChange={onChange} // Handling editor changes
                    />
                )}
            />
        </div>
    )
}