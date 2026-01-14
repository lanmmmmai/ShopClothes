import React, {useState} from "react";

import { useNavigate } from "react-router-dom";
export default (props) => {
	const [input1, onChangeInput1] = useState('');
	const [input2, onChangeInput2] = useState('');
	const [input3, onChangeInput3] = useState('');
	const navigate = useNavigate();
	return (
		<div className="min-h-screen w-full bg-black overflow-x-hidden">
			<div className="flex min-h-screen w-full bg-black">
				<div className="flex w-full min-h-screen items-stretch">
					<div className="flex flex-col shrink-0 w-72 items-start bg-black p-5 gap-5">
						<div className="flex items-center px-[26px] gap-2.5">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/mm4jc0ny_expires_30_days.png"} 
								className="w-8 h-8 object-fill"
							/>
							<span className="text-white text-xl font-bold" >
								{"Clothes"}
							</span>
						</div>
						<div className="flex flex-col items-start gap-5">
							<div className="flex flex-col items-start">
								<div className="flex flex-col items-start py-[17px] px-1.5 w-full">
									<span className="text-white text-xs" >
										{"DISCOVER"}
									</span>
								</div>
								<div className="flex items-start bg-black py-2 px-1.5 mr-3 gap-2.5 rounded-[10px]">
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/8ei04kat_expires_30_days.png"} 
										className="w-6 h-6 rounded-[10px] object-fill"
									/>
									<span className="text-white text-base" >
										{"Trang Chủ"}
									</span>
									<div className="w-6 h-6">
									</div>
								</div>
							</div>
							<div className="flex flex-col items-start gap-2.5">
								<div className="flex flex-col items-start px-1.5 w-full">
									<span className="text-white text-xs" >
										{"HÀNG TỒN KHO"}
									</span>
								</div>
								<div className="flex flex-col items-start pb-[131px]">
									<div className="flex items-start bg-black py-2 rounded-[10px] cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/products")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/s3ekm240_expires_30_days.png"} 
											className="w-6 h-6 ml-1.5 mr-2.5 rounded-[10px] object-fill"
										/>
										<span className="text-white text-base mr-5" >
											{"Các Sản Phẩm"}
										</span>
									</div>
									<div className="flex items-start py-2 mb-2.5 rounded-lg cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/report")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/g5bfgobs_expires_30_days.png"} 
											className="w-6 h-6 ml-1.5 mr-2.5 rounded-lg object-fill"
										/>
										<span className="text-white text-base mr-[67px]" >
											{"Báo Cáo"}
										</span>
									</div>
									<div className="flex items-start py-2 mb-2.5 rounded-lg cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/schedule")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/l0ep19t1_expires_30_days.png"} 
											className="w-6 h-6 ml-1.5 mr-2.5 rounded-lg object-fill"
										/>
										<span className="text-white text-base mr-[62px]" >
											{"Lịch Trình"}
										</span>
									</div>
									<div className="flex items-start bg-black py-2 px-1.5 mb-2.5 gap-2.5 rounded-[10px] cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/customers")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/mioum7kk_expires_30_days.png"} 
											className="w-6 h-6 rounded-[10px] object-fill"
										/>
										<span className="text-white text-base" >
											{"Khách Hàng"}
										</span>
										<div className="w-6 h-6 cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/settings")}>
										</div>
									</div>
									<div className="flex items-center bg-black mb-[131px] rounded-[10px]">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/zhmi4xcf_expires_30_days.png"} 
											className="w-[22px] h-[22px] ml-1.5 mr-2.5 rounded-[10px] object-fill"
										/>
										<span className="text-white text-base mr-5">{"Cài Đặt"}</span>
									</div>
								</div>
							</div>
						</div>
						<div className="flex items-center pt-[260px]">
							<div className="flex shrink-0 items-center gap-2.5">
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/l1go57h9_expires_30_days.png"} 
									className="w-10 h-10 object-fill"
								/>
								<div className="flex flex-col shrink-0 items-start gap-0.5">
									<span className="text-white text-[11px] font-bold" >
										{"Lương Đức Thành"}
									</span>
									<span className="text-[#757575] text-xs mr-[52px]" >
										{"Thu ngân"}
									</span>
								</div>
							</div>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/yew2d27r_expires_30_days.png"} 
								className="w-5 h-5 object-fill"
							/>
						</div>
					</div>
					<div className="flex flex-1 flex-col bg-neutral-100 py-[21px] px-5 gap-5 rounded-xl">
						<div className="flex justify-between items-start self-stretch">
							<span className="text-black text-2xl font-bold" >
								{"Danh sách lịch trình"}
							</span>
							<div className="flex shrink-0 items-start gap-[3px]">
								<button className="flex flex-col shrink-0 items-start bg-transparent text-left py-1.5 px-3 rounded-md border border-solid border-black"
									onClick={()=>alert("Pressed!")}>
									<span className="text-black text-base" >
										{"Ngày"}
									</span>
								</button>
								<button className="flex flex-col shrink-0 items-start bg-transparent text-left py-1.5 px-3 rounded-md border border-solid border-black"
									onClick={()=>alert("Pressed!")}>
									<span className="text-black text-base" >
										{"Tuần"}
									</span>
								</button>
								<button className="flex flex-col shrink-0 items-start bg-black text-left py-1.5 px-3 rounded-md border-0"
									onClick={()=>alert("Pressed!")}>
									<span className="text-white text-base" >
										{"Tháng"}
									</span>
								</button>
								<button className="flex flex-col shrink-0 items-start bg-transparent text-left py-1.5 px-3 rounded-md border border-solid border-black"
									onClick={()=>alert("Pressed!")}>
									<span className="text-black text-base" >
										{"Năm"}
									</span>
								</button>
							</div>
						</div>
						<div className="flex items-start self-stretch gap-6">
							<div className="flex flex-col shrink-0 items-start bg-white p-5 gap-5 rounded-[10px] border border-solid border-[#E5E5EA]">
								<div className="flex flex-col items-start bg-white gap-3.5 rounded-[10px]">
									<button className="flex items-center bg-black text-left py-3 px-[62px] gap-2.5 rounded-md border-0"
										onClick={()=>alert("Pressed!")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/253ohoy9_expires_30_days.png"} 
											className="w-5 h-5 rounded-md object-fill"
										/>
										<span className="text-white text-base" >
											{"Thêm lịch trình"}
										</span>
									</button>
									<div className="flex flex-col items-start p-2.5 gap-2.5 rounded-md border border-solid border-[#E5E5EA]">
										<div className="flex items-start">
											<span className="text-black text-base mr-[70px]" >
												{"22 Tháng 10 , 2025"}
											</span>
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/ctl1772t_expires_30_days.png"} 
												className="w-10 h-5 object-fill"
											/>
										</div>
										<div className="flex flex-col items-center bg-white py-3.5 px-2.5">
											<div className="flex items-start mb-[29px]">
												<span className="text-black text-sm mr-[19px]" >
													{"Su"}
												</span>
												<span className="text-black text-sm mr-[19px]" >
													{"Mo"}
												</span>
												<span className="text-black text-sm mr-[19px]" >
													{"Tu"}
												</span>
												<span className="text-black text-sm mr-[19px]" >
													{"We"}
												</span>
												<span className="text-black text-sm mr-[23px]" >
													{"Th"}
												</span>
												<span className="text-black text-sm mr-[22px]" >
													{"Fr"}
												</span>
												<span className="text-black text-sm" >
													{"Sa"}
												</span>
											</div>
											<div className="flex items-start mb-[29px]">
												<span className="text-[#8C8C8C] text-sm mr-[21px]" >
													{"28"}
												</span>
												<span className="text-[#8C8C8C] text-sm mr-5" >
													{"29"}
												</span>
												<span className="text-[#8C8C8C] text-sm mr-[26px]" >
													{"30"}
												</span>
												<span className="text-black text-sm mr-8" >
													{"1"}
												</span>
												<span className="text-black text-sm mr-[29px]" >
													{"2"}
												</span>
												<span className="text-black text-sm mr-[29px]" >
													{"3"}
												</span>
												<span className="text-black text-sm" >
													{"4"}
												</span>
											</div>
											<div className="flex items-start mb-[29px]">
												<span className="text-black text-sm mr-[29px]" >
													{"5"}
												</span>
												<span className="text-black text-sm mr-[30px]" >
													{"6"}
												</span>
												<span className="text-black text-sm mr-[30px]" >
													{"7"}
												</span>
												<span className="text-black text-sm mr-[30px]" >
													{"8"}
												</span>
												<span className="text-black text-sm mr-[26px]" >
													{"9"}
												</span>
												<span className="text-black text-sm mr-6" >
													{"10"}
												</span>
												<span className="text-black text-sm" >
													{"11"}
												</span>
											</div>
											<div className="flex items-start mb-[13px]">
												<span className="text-black text-sm mr-[22px]" >
													{"12"}
												</span>
												<span className="text-black text-sm mr-[23px]" >
													{"13"}
												</span>
												<span className="text-black text-sm mr-[23px]" >
													{"14"}
												</span>
												<span className="text-black text-sm mr-[23px]" >
													{"15"}
												</span>
												<span className="text-black text-sm mr-[23px]" >
													{"16"}
												</span>
												<span className="text-black text-sm mr-[23px]" >
													{"17"}
												</span>
												<span className="text-black text-sm" >
													{"18"}
												</span>
											</div>
											<div className="flex items-center mb-[15px]">
												<span className="text-black text-sm mr-[22px]" >
													{"19"}
												</span>
												<span className="text-black text-sm mr-[22px]" >
													{"20"}
												</span>
												<span className="text-black text-sm mr-3" >
													{"21"}
												</span>
												<button className="flex flex-col shrink-0 items-start bg-neutral-700 text-left p-2.5 mr-[11px] rounded-[50px] border-0"
													onClick={()=>alert("Pressed!")}>
													<span className="text-white text-sm" >
														{"22"}
													</span>
												</button>
												<span className="text-black text-sm mr-[21px]" >
													{"23"}
												</span>
												<span className="text-black text-sm mr-[21px]" >
													{"24"}
												</span>
												<span className="text-black text-sm" >
													{"25"}
												</span>
											</div>
											<div className="flex items-start">
												<span className="text-black text-sm mr-[21px]" >
													{"26"}
												</span>
												<span className="text-black text-sm mr-[21px]" >
													{"27"}
												</span>
												<span className="text-black text-sm mr-[21px]" >
													{"28"}
												</span>
												<span className="text-black text-sm mr-5" >
													{"29"}
												</span>
												<span className="text-black text-sm mr-[22px]" >
													{"30"}
												</span>
												<span className="text-black text-sm mr-7" >
													{"31"}
												</span>
												<span className="text-[#8C8C8C] text-sm" >
													{"1"}
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className="flex flex-col items-start gap-2.5">
									<span className="text-black text-base mr-[228px]" >
										{"Người"}
									</span>
									<div className="flex flex-col items-start pb-[127px]">
										<div className="flex items-center bg-white rounded-md border border-solid border-[#8C8C8C]">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/fthxta34_expires_30_days.png"} 
												className="w-[21px] h-[21px] ml-3 mr-2.5 rounded-md object-fill"
											/>
											<input
												placeholder={"Tìm kiếm"}
												value={input2}
												onChange={(event)=>onChangeInput2(event.target.value)}
												className="text-neutral-700 bg-transparent text-sm w-[230px] py-2.5 mr-1 border-0"
											/>
										</div>
										<div className="flex flex-col items-start mb-[127px] gap-2.5">
											<div className="flex items-start pb-2.5 gap-2.5">
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/lfkloac6_expires_30_days.png"} 
													className="w-10 h-10 object-fill"
												/>
												<div className="flex flex-col shrink-0 items-start pr-0 gap-0.5">
													<span className="text-black text-sm font-bold" >
														{"Esther Howard"}
													</span>
													<span className="text-[#757575] text-xs" >
														{"tienlapspktnd@gmail.com"}
													</span>
												</div>
											</div>
											<div className="flex items-start pb-2.5 gap-2.5">
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/h3su0yvu_expires_30_days.png"} 
													className="w-10 h-10 object-fill"
												/>
												<div className="flex flex-col shrink-0 items-start pr-24 gap-0.5">
													<span className="text-black text-sm font-bold" >
														{"Eleanor Pena"}
													</span>
													<span className="text-[#757575] text-xs" >
														{"binhan628@gmail.com"}
													</span>
												</div>
											</div>
										</div>
									</div>
									<button className="flex flex-col items-start bg-transparent text-left py-3 px-[71px] rounded-md border border-solid border-black"
										onClick={()=>alert("Pressed!")}>
										<span className="text-black text-base" >
											{"Lịch trình của tôi"}
										</span>
									</button>
								</div>
							</div>
							<div className="flex flex-1 flex-col gap-5 rounded-md">
								<div className="flex justify-between items-center self-stretch bg-white pr-5 rounded-[10px] border border-solid border-[#E5E5EA]">
									<input
										placeholder={"Tháng 10, 22, 2025"}
										value={input3}
										onChange={(event)=>onChangeInput3(event.target.value)}
										className="flex-1 self-stretch text-black bg-transparent text-base py-5 pl-5 mr-1 border-0"
									/>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/apmvlks0_expires_30_days.png"} 
										className="w-10 h-5 rounded-[10px] object-fill"
									/>
								</div>
								<div className="self-stretch bg-white py-[52px] rounded-[10px] border border-solid border-[#E5E5EA]">
									<div className="flex justify-between items-start self-stretch mb-[106px] mx-12">
										<span className="text-black text-lg" >
											{"Su"}
										</span>
										<span className="text-black text-lg" >
											{"Mo"}
										</span>
										<span className="text-black text-lg" >
											{"Tu"}
										</span>
										<span className="text-black text-lg" >
											{"We"}
										</span>
										<span className="text-black text-lg" >
											{"Th"}
										</span>
										<span className="text-black text-lg" >
											{"Fr"}
										</span>
										<span className="text-black text-lg" >
											{"Sa"}
										</span>
									</div>
									<div className="flex justify-between items-start self-stretch mb-[106px] mx-[49px]">
										<span className="text-[#8C8C8C] text-lg" >
											{"28"}
										</span>
										<span className="text-[#8C8C8C] text-lg" >
											{"29"}
										</span>
										<span className="text-[#8C8C8C] text-lg" >
											{"30"}
										</span>
										<span className="text-black text-lg" >
											{"1"}
										</span>
										<span className="text-black text-lg" >
											{"2"}
										</span>
										<span className="text-black text-lg" >
											{"3"}
										</span>
										<span className="text-black text-lg" >
											{"4"}
										</span>
									</div>
									<div className="flex justify-between items-start self-stretch mb-[106px] mx-[54px]">
										<span className="text-black text-lg" >
											{"5"}
										</span>
										<span className="text-black text-lg" >
											{"6"}
										</span>
										<span className="text-black text-lg" >
											{"7"}
										</span>
										<span className="text-black text-lg" >
											{"8"}
										</span>
										<span className="text-black text-lg" >
											{"9"}
										</span>
										<span className="text-black text-lg" >
											{"10"}
										</span>
										<span className="text-black text-lg" >
											{"11"}
										</span>
									</div>
									<div className="flex justify-between items-start self-stretch mb-[106px] mx-[50px]">
										<span className="text-black text-lg" >
											{"12"}
										</span>
										<span className="text-black text-lg" >
											{"13"}
										</span>
										<span className="text-black text-lg" >
											{"14"}
										</span>
										<span className="text-black text-lg" >
											{"15"}
										</span>
										<span className="text-black text-lg" >
											{"16"}
										</span>
										<span className="text-black text-lg" >
											{"17"}
										</span>
										<span className="text-black text-lg" >
											{"18"}
										</span>
									</div>
									<div className="flex justify-between items-start self-stretch mb-[106px] mx-[50px]">
										<span className="text-black text-lg" >
											{"19"}
										</span>
										<span className="text-black text-lg" >
											{"20"}
										</span>
										<span className="text-black text-lg" >
											{"21"}
										</span>
										<span className="text-black text-lg" >
											{"22"}
										</span>
										<span className="text-black text-lg" >
											{"23"}
										</span>
										<span className="text-black text-lg" >
											{"24"}
										</span>
										<span className="text-black text-lg" >
											{"25"}
										</span>
									</div>
									<div className="flex justify-between items-start self-stretch mx-[49px]">
										<span className="text-black text-lg" >
											{"26"}
										</span>
										<span className="text-black text-lg" >
											{"27"}
										</span>
										<span className="text-black text-lg" >
											{"28"}
										</span>
										<span className="text-black text-lg" >
											{"29"}
										</span>
										<span className="text-black text-lg" >
											{"30"}
										</span>
										<span className="text-black text-lg" >
											{"31"}
										</span>
										<span className="text-[#8C8C8C] text-lg" >
											{"1"}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}