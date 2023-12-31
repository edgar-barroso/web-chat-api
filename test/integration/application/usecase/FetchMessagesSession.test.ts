import { FetchMessagesSession } from "@/application/usecase/fetch-messages-session/FetchMessagesSession"
import { FetchMessagesSessionInput } from "@/application/usecase/fetch-messages-session/FetchMessagesSessionInput"
import { Message } from "@/domain/entity/Message"
import { Session } from "@/domain/entity/Session"
import { User } from "@/domain/entity/User"
import { MessageRepository } from "@/domain/repository/MessageRepository"
import { SessionRepository } from "@/domain/repository/SessionRepository"
import { UserRepository } from "@/domain/repository/UserRepository"
import { InMemoryMessageRepository } from "@/infra/repository/in-memory/InMemoryMessageRepository"
import { InMemorySessionRepository } from "@/infra/repository/in-memory/InMemorySessionRepository"
import { InMemoryUserRepository } from "@/infra/repository/in-memory/InMemoryUserRepository"


let sessionRepository:SessionRepository
let messageRepository:MessageRepository
let userRepository:UserRepository
let session:Session
let user_1:User
let user_2:User


beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    sessionRepository = new InMemorySessionRepository()
    messageRepository = new InMemoryMessageRepository()
    user_1 = new User("userNameTest1", "123456")
    user_2 = new User("userNameTest2", "123456")
    session = new Session("sessao_1")
    await userRepository.create(user_1)
    await userRepository.create(user_2)

    await sessionRepository.create(session)
    const message1 = new Message("Hello world - 1", user_1.getId(), session.getId(), new Date("2022-01-01"))
    const message2 = new Message("Hello world - 2", user_2.getId(), session.getId(), new Date("2023-01-01"))
    await messageRepository.create(message1)
    await messageRepository.create(message2)

})

test("Deve receber todas as messagens em uma sessão",async ()=>{
    const fetchMessagesSession = new FetchMessagesSession(sessionRepository,messageRepository,userRepository)
    const input = new FetchMessagesSessionInput(user_1.getId(),session.getId())
    const output = await fetchMessagesSession.execute(input)
    expect(output).toMatchObject({messages:
        [
            {userName:"userNameTest1",content:"Hello world - 1",date:new Date("2022-01-01")},
            {userName:"userNameTest2",content:"Hello world - 2",date:new Date("2023-01-01")}

        ]
    })

})

test("Deve levantar um erro ao tentar receber as messagens de um sessão que não existe",async ()=>{
    const fetchMessagesSession = new FetchMessagesSession(sessionRepository,messageRepository,userRepository)
    const input = new FetchMessagesSessionInput(user_1.getId(),"notExistSessionId")
    expect(async()=>await fetchMessagesSession.execute(input)).rejects.toThrow("Session not found")

})

test("Deve levantar um erro ao tentar receber as messagens com um usuário que nao existe",async ()=>{
    const fetchMessagesSession = new FetchMessagesSession(sessionRepository,messageRepository,userRepository)
    const input = new FetchMessagesSessionInput("NotExistsUserId",session.getId())
    expect(async()=>await fetchMessagesSession.execute(input)).rejects.toThrow("User not found")

})

