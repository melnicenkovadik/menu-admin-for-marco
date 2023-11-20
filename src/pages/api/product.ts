import {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../lib/mongodb";
import {ObjectId} from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const client = await clientPromise;
    const db = client.db("TAVERNA-DB");

    const {method} = req;

    switch (method) {
        case "POST":
            try {
                const newProduct = req.body.newProduct;
                const categoryID = req.body.categoryID;
                const newProductID = new ObjectId();
                console.log("categoryID", categoryID);
                console.log("newProductID", newProductID);
                newProduct._id = newProductID;
                const category = await db.collection("categories")
                    .updateOne({_id: new ObjectId(categoryID)},
                        {
                            $push: {
                                products: newProduct
                            },
                        });
                const updatedCategory = await db.collection("categories").findOne({_id: new ObjectId(categoryID)});
                res.status(201).json({success: true, data: updatedCategory});

            } catch (e) {
                res.status(400).json({success: false});
            }
            break;
        case "PUT":
            try {
                const updatedProduct = req.body.updatedProduct;
                const categoryID = req.body.categoryID;
                const productID = req.body.productID;

                const newProduct = {
                    ...updatedProduct,
                    _id: new ObjectId(productID)
                };
                await db
                    .collection("categories")
                    .updateOne({_id: new ObjectId(categoryID), "products._id": new ObjectId(productID)},
                        {
                            $set: {
                                "products.$": newProduct
                            },
                        });

                const updatedCategory = await db.collection("categories").findOne({_id: new ObjectId(categoryID)});
                res.status(201).json({success: true, data: updatedCategory});

            } catch (e) {
                res.status(400).json({success: false});
            }
            break;
        case "DELETE":
            try {
                const categoryID = req.body.categoryID;
                const productID = req.body.productID;
                console.log("categoryID", categoryID);
                console.log("productID", productID);
                await db
                    .collection("categories")
                    .updateOne({_id: new ObjectId(categoryID)},
                        {
                            $pull: {
                                products: {_id: new ObjectId(productID)}
                            },
                        });

                const updatedCategory = await db.collection("categories").findOne({_id: new ObjectId(categoryID)});
                res.status(201).json({success: true, data: updatedCategory});
            } catch (e) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: e.message
                    }
                });
            }

            break;
    }
}
