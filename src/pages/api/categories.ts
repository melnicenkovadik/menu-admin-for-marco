import {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../lib/mongodb";
import {ObjectId} from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const client = await clientPromise;
    const db = client.db("TAVERNA-DB");

    const {method} = req;

    switch (method) {
        case "GET":
            try {
                console.log("GET [categories]");
                const categories = await db.collection("categories").find({}).toArray();
                res.status(200).json({success: true, data: categories});
            } catch (e) {
                res.status(400).json({success: false});
            }
            break;
        case "POST":
            try {
                console.log("POST [categories]");
                const category =  await db.collection("categories").insertOne(req.body);
                const newCategory = await db.collection("categories").findOne({_id: new ObjectId(category.insertedId)});
                res.status(201).json({success: true, data: newCategory});
            } catch (e) {
                res.status(400).json({success: false});
            }
            break;
        case "DELETE":
            try {
                console.log("DELETE [categories]");
                const categoryID = req.body.categoryID;
                console.log("DELETE [categories] categoryID: ", categoryID);
                const category = await db.collection("categories").deleteOne({_id: new ObjectId(categoryID)});
                res.status(201).json({success: true, data: categoryID});
            } catch (e) {
                res.status(400).json({success: false});
            }
            break;
        case "PUT":
            try {
                console.log("PUT [categories]");

                const category = await db.collection("categories")
                    .updateOne({_id: new ObjectId(req.body.categoryID)},
                        {
                            $set: {
                                ...req.body.newCategory,
                            },
                        });
                const updatedCategory = await db.collection("categories").findOne({_id: new ObjectId(req.body.categoryID)});
                res.status(201).json({success: true, data: updatedCategory});
            } catch (e) {
                res.status(400).json({success: false, error: e});
            }
            break;
        default:
            res.status(400).json({success: false});
            break;
    }
}
