/** get the unique id of a command */
export const getCommandId = (serviceName: string, serviceVersion: string, commandName: string) =>
  `command_${serviceName}_${serviceVersion}_${commandName}`
