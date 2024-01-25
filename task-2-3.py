#!/usr/bin/python3 
import cvsw 
import time
from websocket_server import WebsocketServer
import threading
import json

CLIENTS = []

def new_client(client, server):
    CLIENTS.append(client)

def client_left(client, server):
    CLIENTS.remove(client)

def send(server, msg):
    for client in CLIENTS:
        server.send_message(client, msg)

def retrieveData(server):
    mcdfacade = cvsw.mcd.Mcd3Facade() 
    mcdfacade.prepareInterface() 
    mcdfacade.openProject('DSA_Octavia', 'VIT_DSA_Octavia')
    rt_logical_link_engine = cvsw.mcd.RTLogicalLink('LL_BV_ECM')
    rt_logical_link_engine.identifyAndSelectVariant()
    service_engine = rt_logical_link_engine.createServiceByName('DC_ReadDataByIdentMeasuValue')
    rt_logical_link_steer = cvsw.mcd.RTLogicalLink('LL_BV_Steer')
    rt_logical_link_steer.identifyAndSelectVariant()
    service_steer = rt_logical_link_steer.createServiceByName('DC_ReadDataByIdentMeasuValue')
    while True:
        time.sleep(1)
        print('Retrieve Data')
        try:
            response_engine = service_engine.execute({'PA_RecorDataIdent':'Absolute Throttle Position'}, False)
            response_steer = service_steer.execute({'PA_RecorDataIdent':'Steering moment'}, False)
            for response in response_steer:
                if response.isPositiveResponse():
                    steer_moment = response.getResponseParameter('PA_DataRecor.PA_SteerMomen').getValue()
                    print('Steering Moment: ',steer_moment)
            response_steer = service_steer.execute({'PA_RecorDataIdent':'Steering wheel angle'}, False)
            for response in response_steer:
                if response.isPositiveResponse():
                    steer_angle = response.getResponseParameter('PA_DataRecor.PA_SteerWheelAngle').getValue()
                    print('Steering Wheel Angle: ',steer_angle)
            for response in response_engine:
                if response.isPositiveResponse():
                    pedal_absolute = response.getResponseParameter('PA_DataRecor.PA_Absol').getValue()
                    print('Absolut Throttle Position: ',pedal_absolute)
            response_engine = service_engine.execute({'PA_RecorDataIdent':'Accelerator Pedal Position D'}, False)
            for response in response_engine:
                if response.isPositiveResponse():
                    pedal_accelD = response.getResponseParameter('PA_DataRecor.PA_Accel').getValue()
                    print('Accelerator Pedal Position D: ',pedal_accelD)
            response_engine = service_engine.execute({'PA_RecorDataIdent':'Accelerator Pedal Position E'}, False)
            for response in response_engine:
                if response.isPositiveResponse():
                    pedal_accelE = response.getResponseParameter('PA_DataRecor.PA_Accel').getValue()
                    print('Accelerator Pedal Position E: ',pedal_accelE)
            response_engine = service_engine.execute({'PA_RecorDataIdent':'Relative Throttle Position'}, False)
            for response in response_engine:
                if response.isPositiveResponse():
                    pedal_relative = response.getResponseParameter('PA_DataRecor.PA_Relat').getValue()
                    print('Relative Throttle Position: ',pedal_relative)
        except Exception as e:
            print('catched exception', e)
        print('')
        data = json.dumps({'SteeringMoment':steer_moment,'SteeringWheelAngle':steer_moment,'AbsolutThrottlePosition':pedal_absolute,'AcceleratorPedalPositionD':pedal_accelD,'AcceleratorPedalPositionE':pedal_accelE,'RelativeThrottlePosition':pedal_relative})
        send(server, data)

def main():
    host = '192.168.150.1'
    print(f"Host: {host}")
    server = WebsocketServer(host=host, port=6060)
    server.set_fn_new_client(new_client)
    server.set_fn_client_left(client_left)
    threading.Thread(target=retrieveData, args=(server,)).start()
    server.run_forever()

if __name__ == '__main__':
        main()
        