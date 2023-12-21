'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { ComboboxDemo } from '@/components/ui/ComboBox';
import React from 'react';
import { CopyBlock, atomOneDark } from 'react-code-blocks';
import { VscWarning } from 'react-icons/vsc';

const ApiKeys = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex w-full max-w-[80ch] flex-col gap-3">
            <div className="w-full space-y-2">
              <h3 className="truncate text-3xl font-medium tracking-tight">
                API Keys
              </h3>
              <p className="truncate text-sm text-muted-foreground">
                Manage API keys to access useCredit API
              </p>
            </div>
            <Alert className="bg-yellow-400/20">
              <VscWarning className="h-4 w-4" />
              <AlertTitle className="text-muted-foreground">
                Use Credit Support will NEVER ask for your secret keys.
              </AlertTitle>
              <AlertDescription className="text-muted-foreground/70">
                If you suspect that one of your secret keys has been
                compromised, you can rotate them below.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 p-6 bg-accent rounded-lg">
        <div className="flex gap-4 items-center">
          <div className="space-y-2">
            <p className="font-medium">Quick copy</p>
            <p className="text-sm text-muted-foreground/70">
              Select your framework, then copy and paste the code snippet into
              your environment file
            </p>
          </div>
          <ComboboxDemo />
        </div>
        <div className="w-full h-96 flex flex-1"></div>
      </div>
    </div>
  );
};

export default ApiKeys;
