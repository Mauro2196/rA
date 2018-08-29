function getCommandMap() as Object
    return {
        "isInFocus" : "UIIsInFocus",
        "getElementText" : "UIgetElementText",
        "inputElementText" : "UIinputElementText",
        "getElementMeasures" : "UIgetElementMeasures",
        "getElementChild" : "UIgetElementChild",
        "getElementChildCount" : "UIgetElementChildCount",
        "getElementLabelChild" : "UIgetElementLabelChild",
        "isVisible" : "UIisVisible",
        
    }
End function

function UIgetElementLabelChild(args) as Object
    m.mainScene=m.top.getParent() 
    elementFindbyId = getNodebyId(args.data.id)
    for i = 0 to elementFindbyId.getChildCount()-1
        elementFindbyIdChild = elementFindbyId.getChild(i)
        if elementFindbyIdChild.subtype() = "Label"
            response = CreateObject("roAssociativeArray")
            response["LabelChildText"] = elementFindbyIdChild.text
        end if
    end for
    return response
End function

function UIgetElementChildCount(args) as Object
    m.mainScene=m.top.getParent() 
    elementFindbyId = getNodebyId(args.data.id)
    response = CreateObject("roAssociativeArray")
    response["childCount"] = elementFindbyIdChild.getChildCount()
    return response
End function

function UIgetElementChild(args) as Object
    m.mainScene=m.top.getParent() 
    elementFindbyId = getNodebyId(args.data.id)
    elementFindbyIdChild = elementFindbyId.getChild(Val(args.data.numberChild))
    response = CreateObject("roAssociativeArray")
    response["hasFocus"] = elementFindbyIdChild.hasFocus()
    return response
End function

function UIIsInFocus(args) as Object
    m.mainScene=m.top.getParent() 
    elementFindbyId = getNodebyId(args.data.id)
    response = CreateObject("roAssociativeArray")
    response[args.data["command"]] = elementFindbyId.hasFocus()
    return response
End function

function UIisVisible(args) as Object
    m.mainScene=m.top.getParent() 
    elementFindbyId = getNodebyId(args.data.id)
    response = CreateObject("roAssociativeArray")
    response[args.data["command"]] = elementFindbyId.visible
    return response
End function

function UIgetElementText(args) as Object
    m.mainScene=m.top.getParent() 
    elementFindbyId = getNodebyId(args.data.id)
    response = CreateObject("roAssociativeArray")
    response[args.data["command"]] = elementFindbyId.text
    return response
End function

function callCommand(command, args) as Object
    
    return m.top.callFunc(command, args)

End function

sub UDPPeer()
  ?"MAIN...."
  messagePort = CreateObject("roMessagePort")
  connections = {}
  buffer = CreateObject("roByteArray")
  buffer[1024] = 0
  tcpListen = CreateObject("roStreamSocket")
  tcpListen.setMessagePort(messagePort)
  addr = CreateObject("roSocketAddress")
  addr.setPort(54321)

  tcpListen.setAddress(addr)
  tcpListen.notifyReadable(true)
  tcpListen.notifyWritable(true)

  x = tcpListen.listen(4)

  if not tcpListen.eOK()
      print "Error creating listen socket"
     
  end if

  while True
      event = wait(0, messagePort)

      if type(event) = "roSocketEvent"
          print "GOT HERE"
          changedID = event.getSocketID()

          if changedID = tcpListen.getID() and tcpListen.isReadable()
              newConnection = tcpListen.accept()

              if newConnection = Invalid
                  print "accept failed"
              else
                  print "accepted new connection " newConnection.getID()
                  newConnection.notifyReadable(true)
                  newConnection.setMessagePort(messagePort)
                  connections[Stri(newConnection.getID())] = newConnection
              end if

          else
              ' Activity on an open connection
              connection = connections[Stri(changedID)]
              closed = False

              if connection.isReadable()
                  received = connection.receive(buffer, 0, 512)
                  print "received is " received

                  if received > 0
                        print "Received in Roku: '"; buffer.ToAsciiString(); "'"
                        str = buffer.ToAsciiString().Left(received)
                        request = ParseJson(str)
                        buffer = CreateObject("roByteArray")
                        buffer[1024] = 0
                        data = onDataReceive(str)

                        'connection.send(buffer, 0, data)
                        connection.SendStr(data)
                  else if received=0 ' client closed
                      closed = True
                  end if
              end if

              if closed or not connection.eOK()
                  print "closing connection " changedID
                  connection.close()
                  buffer[512] = 0
                  connections.delete(Stri(changedID))
              end if
          end if
      end if
  end while

  print "Main loop exited"
  tcpListen.close()

  for each id in connections
      connections[id].close()
  end for
end sub
Sub init()
    m.mainScene=m.top.getParent()   
    m.top.functionName = "UDPPeer"
    m.top.control = "RUN"
End Sub

function convertToAssosarray(node as dynamic)
  if type(node) = "roSGNode"
    nodeAssosarray = node.getFields()
    for each item in nodeAssosarray.Items()
      if type(item.value) = "roSGNode"
        nodeAssosarray.AddReplace(item.key,convertToAssosarray(item.value))
      end if
    end for
  end if
  return nodeAssosarray
end function

function onDataReceive(data as dynamic)
    dataReceive=Parsejson(data) 
    handlersMap = getCommandMap() 
    handler = handlersMap[dataReceive.data["command"]]
    if handler <> Invalid then
        response = callCommand(handler, dataReceive)
    else
        response = getError("No such command")
    end if
  
    'm.mainScene=m.top.getParent()
    'elementFindbyId = m.mainScene.findNode(dataReceive.data.id)
    'if type(elementFindbyId) = "roSGNode"
    '    elementFindAssosarray=convertToAssosarray(elementFindbyId)
    '    ?elementFindAssosarray;"hey Elementq"
    '    elementFindAssosarray[dataReceive.data.functionName] = elementFindbyId.hasFocus()
    '    elementFind=FormatJson(elementFindAssosarray)
    'else if type(elementFind) <> Invalid
    '    elementFind="{'Invalid': 'ID dont Found' }"
    'end if
    ?response
    return FormatJson(response)
end function

function getNodebyId(id as string) as Object
    elementbyID = m.mainScene.findNode(id)
    if elementbyID <> Invalid then
        return elementbyID
    else
        return getError("Node not found")
    end if
end function
' Returns error object
' @param {string} message - error message
Function getError(message as String) as Object
    return { error: { message: message } }
End Function