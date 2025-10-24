import { Injectable } from '@angular/core';

declare var puter: any; // because puter is loaded globally

interface LlmResponse {
  model: string;
  reply: string;
}

@Injectable({
  providedIn: 'root',
})
export class MultiLlmChatService {
  private models = [
    { name: 'GPT', model: 'gpt-5-nano' },
    { name: 'Claude', model: 'claude' },
    { name: 'Gemini', model: 'gemini-2.0-flash' },
    { name: 'Deepseek', model: 'deepseek-chat' },
    { name: 'Deepseek Reasoner', model: 'deepseek-reasoner' },
    { name: 'Grok', model: 'grok-beta' },
  ];

  async askLlm(message: string, modelName: string): Promise<LlmResponse> {
    const modelResponse = this.models.find((mod) => mod.name === modelName);

    if (!modelResponse) {
      return Promise.reject('Model not found');
    }

    const response = await puter.ai.chat(message, {
      model: modelResponse.model,
    });

    console.log('llm response:', modelName, response);

    let text = '';

    if (typeof response === 'string') {
      text = response;
    } else if (typeof response === 'object') {
      if (modelName === 'Claude') {
        text = response?.message?.content?.[0]?.text || '';
      } else {
        text = response?.message?.content || '';
      }
    } else {
      text = JSON.stringify(response);
    }

    return { model: modelResponse.name, reply: text };
  }

  async askAll(message: string): Promise<LlmResponse[]> {
    const results = await Promise.allSettled(
      this.models.map(async (model) => {
        try {
          return await this.askLlm(message, model.name);
        } catch (error) {
          console.error(`Error with model ${model.name}:`, error);
          return { model: model.name, reply: `Error: ${error}` };
        }
      })
    );

    console.log('All model results:', results);

    return results.map((res) =>
      res.status === 'fulfilled' ? res.value : { model: 'Unknown', reply: 'Error occurred' }
    );
  }
}
