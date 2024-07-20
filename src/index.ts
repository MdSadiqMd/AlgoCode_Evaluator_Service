import bodyParser from "body-parser";
import express, { Express } from "express";

import serverConfig from "./config/server.config";
import apiRouter from "./routes";
import SampleWorker from "./workers/sample.worker";
import serverAdapter from "./config/bullBoard.config";
import logger from "./config/logger.config";
import SubmissionWorker from "./workers/submission.worker";
import { submission_queue } from "./utils/constants.utils";

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/api', apiRouter);
app.use(serverConfig.BULLBOARDPATH, serverAdapter.getRouter());

app.listen(serverConfig.PORT, async () => {
    logger.info(`Server started at ${JSON.stringify(serverConfig.PORT)}`);

    SampleWorker('SampleQueue');
    SubmissionWorker(submission_queue);

    /* const code = `print(input())`;
    const testCase = `100
    200`;
    runPython(code, testCase); */


    /* const code = `
    import java.util.*;
    public class Main{
        public static void main(String[] args){
            Scanner sc=new Scanner(System.in);
            int input=sc.nextInt();
                System.out.println(input);
        }
    }
    `;
    const testCase = `10`;
    const outputCase = `10`;
    const javaExecutor = new JavaExecutor();
    const { output, status } = await javaExecutor.execute(code, testCase, outputCase);
    logger.info(`The response: ${JSON.stringify(output)}`);
    submissionQueueProducer({
        'userId': output
    });
    logger.info(`Producer response :${JSON.stringify(output)}`);
    if (status) {
        evaluationQueueProducer({ 'userId': { output, status } });
    } */


    /* const userCode = `
    class Solution {
        public:
            vector<int> permute() {
            vector<int> v;
            v.push_back(10);
            return v;
        }
    };
    `;
    const code = `
    #include<iostream>
    #include<vector>
    #include<stdio.h>
    using namespace std;
    ${userCode}
    int main() {
        Solution s;
        vector<int> result = s.permute();
        for(int x : result) {
            cout << x << " ";
        }
        cout << endl;
        return 0;
    }
    `;
    const testCase = `10`;
    runCpp(code, testCase); */


    /* sampleQueueProducer('SampleJob', {
        name: 'Sadiq',
        company: 'UHI',
        location: 'Remote'
    }, 2);
    sampleQueueProducer('SampleJob', {
        name: 'Sadiq1',
        company: 'UHI',
        location: 'Remote'
    }, 1);  */
});
