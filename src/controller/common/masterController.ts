import { Request, Response } from 'express';
import { sendResponse } from '../../utils/responseUtils';
import db from '../../model';

// export const getMasterData = async (req: Request, res: Response) => {
//   try {
//     const classesData = await db.Class.find({}, { _id: 1, className: 1 });
//     const sections = await db.Section.find(
//       {},
//       { _id: 1, classId: 1, sectionName: 1 }
//     );
//     const subjects = await db.Subject.find(
//       {},
//       { _id: 1, classId: 1, subjectName: 1 }
//     );

//     const sectionsData = sections.map((sec) => ({
//       _id: sec._id.toString(),
//       classId: sec.classId.toString(),
//       sectionName: sec.sectionName,
//     }));
//     const subjectsData = subjects.map((sub) => ({
//       _id: sub._id.toString(),
//       classId: sub.classId.toString(),
//       subjectName: sub.subjectName,
//     }));

//     const commonData = {
//       classes: classesData,
//       sections: sectionsData,
//       subjects: subjectsData,
//     };

//     return sendResponse(res, 'Common data fetched successfully', commonData);
//   } catch (error) {
//     console.error(error);
//     return sendResponse(res, 'Internal Server Error', null, false, 500);
//   }
// };

export const getAllActiveEvents = async (req: Request, res: Response) => {
  try {
    const events = await db.SchoolEvent.find()
      .select('-createdAt  -__v')
      .sort({ createdAt: -1 });

    return sendResponse(res, 'Active Events fetched successfully', events);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

export const getCourseSoldCount = async (req: Request, res: Response)=>{
  try {
    const coursePurchaseCounts = await db.Purchase.aggregate([
      {
        $group: {
          _id: '$courseId', // Group by courseId
          count: { $sum: 1 }, // Count the number of purchases for each courseId
        },
      },
    ]);
    if(!coursePurchaseCounts){
      return sendResponse(res, 'No course sold', null, false, 404);
    }

    const response = {
      course:[],
      count:[]
    }
    coursePurchaseCounts.forEach(async(item) => {
      console.log(item, item._id)
      const course =await db.Course.findById(item._id)
      console.log(course)
      response.course.push(course?.title);
      response.count.push(item?.count);
    })

    return sendResponse(res, 'Active Events fetched successfully', response);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
}

export const getTotalCollectionByMonth = async (req: Request, res: Response) => {
  try {
    const purchases = await db.Purchase.find({});
    if (!purchases || purchases.length === 0) {
      return sendResponse(res, 'No course sold', null, false, 404);
    }

    const monthlyCollection: number[] = [];

    for (const purchase of purchases) {
      const purchaseDate = new Date(purchase.purchaseDate);
      const month = purchaseDate.getMonth(); // 0 (Jan) to 11 (Dec)

      const course = await db.Course.findById(purchase.courseId);
      const coursePrice = course?.price || 0;

      if (!monthlyCollection[month]) {
        monthlyCollection[month] = 0;
      }
      monthlyCollection[month] += coursePrice;
    }

    return sendResponse(res, 'Collection fetched successfully', monthlyCollection);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 'Internal Server Error', null, false, 500);
  }
};

