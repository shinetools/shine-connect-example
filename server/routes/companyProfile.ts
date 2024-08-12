import { Request, Response } from 'express';
import { shineRequest } from '../request';

const getCompanyProfile = async (req: Request, res: Response) => {
  const { access_token, companyProfileId } = req.query;

  try {
    const data = await shineRequest({
      method: 'GET',
      path: `/companies/profiles/${companyProfileId}`,
      authorization: access_token as string,
    });
    res.status(200).send(data);
  } catch (error) {
    console.log('Error GEt Company', error);
    res.status(error.status).send({
      status: error.status,
      message: error.body.message,
    });
  }
};

export default getCompanyProfile;
