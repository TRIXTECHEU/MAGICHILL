# MagicHill Chatbot – Extensions

This folder contains small JavaScript extensions used to enhance the MagicHill chat widget.

## Files
- **PayloadWindow.js**  
  Renders and controls the floating payload window that appears above the page when the chatbot needs extra space (e.g. expanded conversation, additional info panels). Handles open/close behaviour and basic layout.

- **TranslateWidget.js**  
  Adds client-side translation support for the chat widget UI. It focuses primarily on **English → Czech** labels and messages so the assistant can be used comfortably by Czech-speaking users.

- **LoadingAnimationExtension.js**  
  Provides the typing / loading animation shown while the AI assistant is generating a reply. Intended to be lightweight and easy to plug into the existing message rendering pipeline.

All extensions are written in plain JavaScript and can be imported individually depending on the needs of the integration.
