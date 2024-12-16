import mongoose from 'mongoose';
import {
  TIvestmentCycleIput,
  TIvestOrExpennces,
} from './investOrExpence.interface';
import { InvestOrExpensesModel } from './investOrExpence.model';
import { investmentUtillFunctions } from './expenceLemitationCheck.utill';
import { BannerServeces } from '../banner/banner.servicces';
import emailSendBulkOrSingle from '../../utility/emailSendBulkOrSingle';

const createInvestOrExpaces = async (payload: TIvestOrExpennces) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // first check the money we are trying to spend is in 
    const isInGrossTotalBalanceLimit =
    await investmentUtillFunctions.expenceBeyondTotalCurrentBalanceCheck(payload.ammountSpent);

    if (isInGrossTotalBalanceLimit.success) {
      // give string for id genaration
      const string = payload.ExpencesType.slice(0, 3);
      //genarate iD function call which will gemarate uynique id for all investment
      const idGenarated =
        await investmentUtillFunctions.expenceOrInvestmentIdGeneretor(
          `${string}`
      );
      // console.log(idGenarated);

      if (idGenarated) {
        // now update the incomming document id with newly generated id
        payload.id = idGenarated;


        const investOrExpense = new InvestOrExpensesModel(payload); // Create an instance of the model
        const result = await investOrExpense.save(); // Save the instance


        // console.log("created in the db is",result)

        // now make default investment update that instance
        if (result && result.ExpencesType === 'investment') {
          const makeADefaultInvestment =
            await InvestOrExpensesModel.findOneAndUpdate(
              { _id: result._id },
              {
                $push: {
                  investmentCycle: {
                    id: result.id,
                    cycleDetail: result.motiveName,
                    cycleType: 'investment',
                    amount: result.ammountSpent,
                    proofImg: result.expenceImg,
                  },
                },
              },
            ).session(session)
          if (!makeADefaultInvestment) {
            
            console.log('have problem making default investment');
            await InvestOrExpensesModel.findOneAndDelete({_id:result._id})
            throw Error('have problem making default investment');
          }
        }


        // now make default changes if it is expence
        if (result && result.ExpencesType === 'expence') {
          const makeADefaultAtjusmentForExpence =
            await InvestOrExpensesModel.findOneAndUpdate(
              { _id: result._id },
              {
                isDiscontinued: true,
              },
            ).session(session)
          if (!makeADefaultAtjusmentForExpence) {
            console.log('have problem make ADefault Atjusment For Expence');
            await InvestOrExpensesModel.findOneAndDelete({_id:result._id})
            throw Error('have problem make ADefault Atjusment For Expence');
          }
        }

        // update contribution list
        if(result._id)
        {
          const updateContributionList = await investmentUtillFunctions.updateContributionListForInvestmentOrExpance(
            result.id,
            result.ammountSpent,
            result.ExpencesType,
            session
          );
          if (!updateContributionList) {
            console.log('have problem update Contribution List');
            await InvestOrExpensesModel.findOneAndDelete({_id:result._id})
            throw Error('have problem update Contribution List');
          }
  
        }


        const updateBannerNumberofInvestment = await BannerServeces.updateBannerTotalNumberOfInvestment(session);
        if (!updateBannerNumberofInvestment) {
          console.log('have problem update Banner Number of Investment');
          await InvestOrExpensesModel.findOneAndDelete({_id:result._id})
          throw Error('have problem update BannerNumber of Investment');
        }

        if (result._id) {
          const expencceCalclution =
            await investmentUtillFunctions.calclutionForGrossReductionOrAddition(
              result.id,
              result.ammountSpent,
              'reduction',
              session,
            );

          await session.commitTransaction();
          await session.endSession();


          // send email to all
          const messageConversition = `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p><strong>Expence Id:</strong>${idGenarated}</p>
                <p><strong>Expence Type:</strong>${payload.ExpencesType}</p>
                <p><strong>Name:</strong>${payload.motiveName}</p>
                <p><strong>Spent Ammount:</strong>${payload.ammountSpent}</p>
                <p><strong>Message:</strong>Check your accout for detail</p>
              </div>`;

            await emailSendBulkOrSingle("all","Expence Update",messageConversition)
          // send email to all
          return result;
        } 
        else {
          throw Error(`creating a Investment or Expences was not Successfull`);
        }


      } 
      else {
        console.log('something went wrong in idGeneretor');
        throw Error('something went wrong in idGeneretor');
      }
    } else {
      throw Error(`${isInGrossTotalBalanceLimit.message}`);
    }
  } 
  catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    console.log('error in createInvestOrExpaces');
    throw Error(err.message || 'error in createInvestOrExpaces');
  }
};

const giveAInputInInvestmentCycle = async (payload: TIvestmentCycleIput) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isInvestment = await investmentUtillFunctions.checkIfInvestment(
      payload.id,
    );
    if (!isInvestment) {
      console.log('cant add input cycle to a Expences, its not investment');
      throw Error('cant add input cycle to a Expences, its not investment');
    }

    const isDiscontinued = await investmentUtillFunctions.checkIsDisCOntinued(
      payload.id,
    );
    if (isDiscontinued) {
      console.log('this Investment Is Discontinued');
      throw Error('this Investment Is Discontinued');
    }

    const updateInvestmentCycle =
      await investmentUtillFunctions.updateInvestmentCycle(payload);
    if (!updateInvestmentCycle) {
      console.log('couldent uppdate Investment cycle');
      throw Error('couldent uppdate Investment cycle');
    }

    const analysisInvestmentTransactionList =
      await investmentUtillFunctions.analisisInvestmentTransactionList(payload);
    if 
    (!analysisInvestmentTransactionList) {
      console.log('couldnt analysis Investment Transaction List');
      throw Error('couldnt analysis Investment Transaction List');
    }
    // console.log(analysisInvestmentTransactionList);


    const { investmentTotal, reInvestTotal, investmentReturnTotal } =
      analysisInvestmentTransactionList;

    // calculation based on analysis of investment cycle list PROFITGENNARATED or MADELOSS
    const netOutcome =
      investmentReturnTotal - (reInvestTotal + investmentTotal);
    const ammountSpent = reInvestTotal + investmentTotal;

    const updateGrossOutcomeOfaInvestment =
      await investmentUtillFunctions.updateGrossOutcomeOfaInvestment(
        payload.id,
        netOutcome,
        ammountSpent,
      );
    if (!updateGrossOutcomeOfaInvestment) {
      console.log('couldnt exacute updateGrossOutcomeOfa Investment');
      throw Error('couldnt exacute updateGrossOutcomeOfa Investment');
    }

    const nature = netOutcome>=0 ? "profit" : "loss"
    const updateContributionList = await investmentUtillFunctions.updateContributionListForInvestmentOrExpance(payload.id,netOutcome,nature,)
    if(!updateContributionList)
    {
      console.log("error in updateContributionList")
      throw Error ("error in updateContributionList")
    }

    // only optional part of investment cycle

    if (payload.cycleType === 'reInvest') {
      const destrybuteProfiteOrLossToAll =
        await investmentUtillFunctions.calclutionForGrossReductionOrAddition(
          payload.id,
          payload.amount,
          'reduction',
          session,
        );
    } else {
      const destrybuteProfiteOrLossToAll =
        await investmentUtillFunctions.calclutionForGrossReductionOrAddition(
          payload.id,
          payload.amount,
          'addition',
          session,
        );
    }

    // commit the changes
    await session.commitTransaction();


     // send email to all
     const messageConversition = `
     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
       <h2>Investment Update</h2>
       <p><strong>Investment Id:</strong>${payload.id}</p>
       <p><strong>Investment Outcome:</strong>${payload.cycleType}</p>
       <p><strong>Ammount:</strong>${payload.amount}</p>
       <p><strong>Message:</strong>Check your accout for detail</p>
     </div>`;

   await emailSendBulkOrSingle("all","Investment Cycle Update",messageConversition)
 // send email to all


    return updateGrossOutcomeOfaInvestment;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw {
      success: false,
      message: err.message || 'An unknown error occurred.',
    };
  }
};

const disContinueANInvestment = async (investmentId: string) => {
  const result = await InvestOrExpensesModel.findOneAndUpdate(
    { id: investmentId },
    { isDiscontinued: true },
    { new: true },
  );
  


  // send email to all
  const messageConversition = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Investment Update</h2>
    <p><strong>Investment Id:</strong>${investmentId}</p>
    <p><strong>Investment Status:</strong>Discontinued</p>
    <p><strong>Message:</strong>Check your accout for detail</p>
  </div>`;

  await emailSendBulkOrSingle("all","Investment Update",messageConversition)
  // send email to all

  return result;
};

const fidAllIvestmetAndExpences = async () => {
  const result = await InvestOrExpensesModel.find();
  return result;
};

const findSingleIvestmetAndExpences = async (
  investOrExpeceId: string
) => {
  const result = await InvestOrExpensesModel.findOne({id:investOrExpeceId});
  return result
};

export const investOrExpencesServeces = {
  createInvestOrExpaces,
  fidAllIvestmetAndExpences,
  findSingleIvestmetAndExpences,
  giveAInputInInvestmentCycle,
  disContinueANInvestment,
};
