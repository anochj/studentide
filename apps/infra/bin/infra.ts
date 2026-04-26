#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { IDEStack } from "../lib/ide-stack";

const app = new cdk.App();
new IDEStack(app, "IDEStack");
