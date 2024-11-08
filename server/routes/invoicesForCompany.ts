import { Request, Response } from 'express';
import { shineRequest } from '../request';

// @deprecated
const getInvoicesForCompany = async (req: Request, res: Response) => {
  const { access_token, companyProfileId } = req.query;

  try {
    const data = await shineRequest({
      method: 'GET',
      path: `/invoicing/invoices?companyProfileId=${companyProfileId}&first=10`,
      //path: `/invoices/query?companyProfileId=${companyProfileId}&first=10`,
      authorization: access_token as string,
    });
    res.status(200).send(data);
  } catch (error) {
    res.status(error.status).send({
      status: error.status,
      message: error.body.message,
    });
  }
};

export default getInvoicesForCompany;
