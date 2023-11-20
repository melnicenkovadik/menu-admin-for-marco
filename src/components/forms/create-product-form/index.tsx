import React from "react";
import toast from "react-hot-toast";
import {useRecoilState} from "recoil";
import {categoriesState} from "../../../store/atoms/categories";
import axios from "axios";
import { Button, Input} from "@nextui-org/react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const createProductSchema = z.object({
    title: z.object({
        en: z.string().nonempty({message: "Product name is required"}),
        ua: z.string().nonempty({message: "Product name is required"}),
        it: z.string().nonempty({message: "Product name is required"}),
    }),
    categoryID: z.string(),
    price: z.string().min(0, {message: "Price must be greater than 0"}).max(100000, {message: "Price must be less than 100000"}),
    description: z.object({
        en: z.string(),
        ua: z.string(),
        it: z.string(),
    }),
});
type FormData = z.infer<typeof createProductSchema>;



export const CreateProductForm = ({category, defaultValues = null, closeModal = null}: any) => {
        const isEditMode = !!defaultValues;
        console.log("defaultValues", defaultValues);

        const [categories, setCategories] = useRecoilState(categoriesState);

        const {
            handleSubmit,
            register,
            reset,
            formState: {errors, isSubmitting, isDirty, isValid},
        } = useForm<FormData>({
            resolver: zodResolver(createProductSchema),
            mode: "all",
            defaultValues: {
                title: {
                    en: defaultValues?.title?.en || "",
                    ua: defaultValues?.title?.ua || "",
                    it: defaultValues?.title?.it || "",
                },
                categoryID: category._id,
                price: defaultValues?.price || undefined,
                description: {
                    en: defaultValues?.description?.en || "",
                    ua: defaultValues?.description?.ua || "",
                    it: defaultValues?.description?.it || "",
                },
            },
        });

        async function onSubmit(data: FormData) {
            let newProduct = {};
            if (isEditMode) {
                newProduct = {
                    title: {
                        en: data.title.en,
                        ua: data.title.ua,
                        it: data.title.it,
                    },
                    price: data.price,
                    description: {
                        en: data.description.en,
                        ua: data.description.ua,
                        it: data.description.it,
                    },
                    categoryID: category._id,
                };
            } else {
                newProduct = {
                    title: {
                        en: data.title.en,
                        ua: data.title.ua,
                        it: data.title.it,
                    },
                    price: data.price,
                    description: {
                        en: data.description.en,
                        ua: data.description.ua,
                        it: data.description.it,
                    },
                    categoryID: category._id,
                };
            }

            if (isEditMode) {
                // const updatedProduct = await fetch("/api/product", {
                //     method: "PUT",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify({
                //         updatedProduct: newProduct,
                //         categoryID: category._id,
                //         productID: defaultValues._id,
                //     }),
                // });
                const updatedProduct = await axios.put("/api/product", {
                    updatedProduct: newProduct,
                    categoryID: category._id,
                    productID: defaultValues._id,
                });

                // const updatedCategory = await updatedProduct.json();
                const updatedCategoryData = updatedProduct.data.data;
                setCategories((prev) => {
                    console.log('updatedCategory updatedCategory',updatedCategoryData);
                    const  newCategories = prev.map((cat) => {
                        if (cat._id === updatedCategoryData._id) {
                            return updatedCategoryData;
                        }
                        return cat;
                    });
                    return newCategories;
                });

                toast.success("Product updated successfully!");
            } else {
                const updatedCat = await fetch("/api/product", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newProduct: newProduct,
                        categoryID: category._id,
                    }),
                });
                const updatedCatData = await updatedCat.json();
                setCategories((prev) => {
                    const updatedCategory = updatedCatData.data;
                    console.log('new cat',updatedCategory);
                    const  newCategories = prev.map((cat) => {
                        if (cat._id === updatedCategory._id) {
                            return updatedCategory;
                        }
                        return cat;
                    });
                    return newCategories;
                });
                toast.success("Product created successfully!");
            }
            closeModal();

            reset();
        };

        return (
            <form className="w-full flex flex-col gap-3 md:gap-6"
                  action=""
                  method="POST"
                  onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3 md:gap-6 ">
                    <label htmlFor="title" className="text-sm md:text-base font-medium text-gray-700">
                        Title
                    </label>
                    <Input isRequired
                           variant="bordered"
                           size="sm"
                           type="text"
                           label="Product title EN"
                           placeholder="Product title EN"
                           defaultValue={defaultValues?.title?.en}
                           {...register("title.en")}
                    />
                    <Input isRequired
                           variant="bordered"
                           size="sm"
                           type="text"
                           label="Product title UA"
                           placeholder="Product title UA"
                           defaultValue={defaultValues?.title?.ua}
                           {...register("title.ua")}
                    />
                    <Input isRequired
                           variant="bordered"
                           size="sm"
                           type="text"
                           label="Product title IT"
                           placeholder="Product title IT"
                           defaultValue={defaultValues?.title?.it}
                           {...register("title.it")}
                    />
                </div>

                <div className="flex flex-col gap-3 md:gap-6 ">
                    <label htmlFor="title" className="text-sm md:text-base font-medium text-gray-700">
                        Price (in EUR)
                    </label>
                    <Input isRequired
                           variant="bordered"
                           size="sm"
                           type="number"
                           label="Price"
                           placeholder="Price"
                           defaultValue={defaultValues?.price}
                           {...register("price")}
                    />
                </div>

                <div className="flex flex-col gap-3 md:gap-6 ">
                    <label htmlFor="title" className="text-sm md:text-base font-medium text-gray-700">
                        Description
                    </label>
                    <Input
                        variant="bordered"
                        size="sm"
                        type="text"
                        label="Product description EN"
                        placeholder="Product description EN"
                        defaultValue={defaultValues?.description?.en}
                        {...register("description.en")}
                    />
                    <Input
                        variant="bordered"
                        size="sm"
                        type="text"
                        label="Product description UA"
                        placeholder="Product description UA"
                        defaultValue={defaultValues?.description?.ua}
                        {...register("description.ua")}
                    />
                    <Input
                        variant="bordered"
                        size="sm"
                        type="text"
                        label="Product description IT"
                        placeholder="Product description IT"
                        defaultValue={defaultValues?.description?.it}
                        {...register("description.it")}
                    />
                </div>

                <div className="flex flex-row gap-3 items-center justify-start">
                    {
                        closeModal && (
                            <Button
                                className="max-w-xs p-4 mb-5"
                                color="danger" variant="light" onPress={() => {
                                closeModal(false);
                            }}>
                                Close
                            </Button>
                        ) || null
                    }
                    <Button size="sm"
                            type="submit"
                            disabled={!isDirty || !isValid || isSubmitting}
                            className="max-w-xs p-4 mb-5"
                            color={isDirty && isValid ? "primary" : "default"}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        );
    }
;
